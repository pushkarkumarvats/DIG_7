"""
Flask API for ML Model Inference
Serves the trained vendor scoring model as a REST API
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from typing import Dict, List, Any
import os

app = Flask(__name__)
CORS(app)

# Load the trained model
MODEL_PATH = os.getenv('MODEL_PATH', './models/vendor_score_model.pkl')
model = None

def load_model():
    """Load the trained model on startup"""
    global model
    try:
        model = joblib.load(MODEL_PATH)
        print(f"✓ Model loaded successfully from {MODEL_PATH}")
        return True
    except Exception as e:
        print(f"✗ Failed to load model: {e}")
        return False

def extract_features(vendor_data: Dict[str, Any]) -> np.ndarray:
    """
    Extract features from vendor data for model prediction
    
    Expected vendor_data structure:
    {
        "internalRecords": [{"deliverySuccessRate": 95, "qualityScore": 90, ...}],
        "externalReviews": [{"rating": 4.5, "sentiment": "positive"}],
        "features": [{"certifications": [...], "yearsInBusiness": 10, "teamSize": 50}],
        "risks": [{"riskLevel": "LOW", "severity": 2}]
    }
    """
    
    # Initialize default values
    features = {
        'avg_delivery_rate': 0.0,
        'avg_quality_score': 0.0,
        'avg_cost_efficiency': 0.0,
        'avg_compliance_score': 0.0,
        'avg_rating': 0.0,
        'positive_sentiment_ratio': 0.0,
        'certification_count': 0,
        'years_in_business': 0,
        'team_size': 0,
        'risk_level_numeric': 0.0,
        'active_risk_count': 0
    }
    
    # Process internal records
    internal = vendor_data.get('internalRecords', [])
    if internal:
        features['avg_delivery_rate'] = np.mean([r.get('deliverySuccessRate', 0) for r in internal])
        features['avg_quality_score'] = np.mean([r.get('qualityScore', 0) for r in internal])
        features['avg_cost_efficiency'] = np.mean([r.get('costEfficiency', 0) for r in internal])
        features['avg_compliance_score'] = np.mean([r.get('complianceScore', 0) for r in internal])
    
    # Process external reviews
    reviews = vendor_data.get('externalReviews', [])
    if reviews:
        features['avg_rating'] = np.mean([r.get('rating', 0) for r in reviews])
        sentiments = [r.get('sentiment') for r in reviews if r.get('sentiment')]
        if sentiments:
            features['positive_sentiment_ratio'] = sum(1 for s in sentiments if s == 'positive') / len(sentiments)
    
    # Process vendor features
    vendor_features = vendor_data.get('features', [])
    if vendor_features:
        feat = vendor_features[0]  # Use first feature record
        features['certification_count'] = len(feat.get('certifications', []))
        features['years_in_business'] = feat.get('yearsInBusiness', 0) or 0
        features['team_size'] = feat.get('teamSize', 0) or 0
    
    # Process risks
    risks = vendor_data.get('risks', [])
    if risks:
        risk_map = {'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4}
        risk_values = [risk_map.get(r.get('riskLevel', 'LOW'), 1) for r in risks]
        features['risk_level_numeric'] = np.mean(risk_values)
        features['active_risk_count'] = len([r for r in risks if r.get('status') == 'ACTIVE'])
    
    # Return as numpy array in the correct order
    feature_array = np.array([
        features['avg_delivery_rate'],
        features['avg_quality_score'],
        features['avg_cost_efficiency'],
        features['avg_compliance_score'],
        features['avg_rating'],
        features['positive_sentiment_ratio'],
        features['certification_count'],
        features['years_in_business'],
        features['team_size'],
        features['risk_level_numeric'],
        features['active_risk_count']
    ]).reshape(1, -1)
    
    return feature_array

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict vendor scores using the trained ML model
    
    Request body:
    {
        "vendorData": {
            "internalRecords": [...],
            "externalReviews": [...],
            "features": [...],
            "risks": [...]
        }
    }
    
    Response:
    {
        "totalScore": 85.5,
        "reliabilityScore": 88.0,
        "costScore": 82.0,
        "capabilityScore": 87.0,
        "performanceScore": 90.0,
        "reputationScore": 86.0,
        "riskScore": 15.0,
        "confidence": 0.92
    }
    """
    
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.json
        vendor_data = data.get('vendorData')
        
        if not vendor_data:
            return jsonify({'error': 'vendorData is required'}), 400
        
        # Extract features
        features = extract_features(vendor_data)
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Get prediction confidence if available
        confidence = 0.85  # Default confidence
        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba(features)
            confidence = float(np.max(proba))
        
        # Calculate component scores (if model supports it)
        # For now, derive from total score with some variation
        total_score = float(prediction)
        
        # Simulate component scores based on total score
        # In production, these would come from a multi-output model
        response = {
            'totalScore': round(total_score, 2),
            'reliabilityScore': round(total_score * 1.05, 2),
            'costScore': round(total_score * 0.95, 2),
            'capabilityScore': round(total_score * 1.02, 2),
            'performanceScore': round(total_score * 1.08, 2),
            'reputationScore': round(total_score * 0.98, 2),
            'riskScore': round((100 - total_score) * 0.3, 2),
            'confidence': round(confidence, 3),
            'modelVersion': '1.0.0'
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    """
    Predict scores for multiple vendors at once
    
    Request body:
    {
        "vendors": [
            {"id": "v1", "data": {...}},
            {"id": "v2", "data": {...}}
        ]
    }
    """
    
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.json
        vendors = data.get('vendors', [])
        
        if not vendors:
            return jsonify({'error': 'vendors array is required'}), 400
        
        results = []
        for vendor in vendors:
            vendor_id = vendor.get('id')
            vendor_data = vendor.get('data')
            
            try:
                features = extract_features(vendor_data)
                prediction = model.predict(features)[0]
                
                results.append({
                    'vendorId': vendor_id,
                    'totalScore': round(float(prediction), 2),
                    'success': True
                })
            except Exception as e:
                results.append({
                    'vendorId': vendor_id,
                    'error': str(e),
                    'success': False
                })
        
        return jsonify({'results': results}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Load model on startup
    if not load_model():
        print("Warning: Running without model. /predict endpoint will fail.")
    
    # Run the server
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'false').lower() == 'true'
    
    print(f"\n🚀 ML Inference API starting on port {port}")
    print(f"   Health check: http://localhost:{port}/health")
    print(f"   Predict: POST http://localhost:{port}/predict")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
