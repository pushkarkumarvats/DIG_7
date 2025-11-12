"""
Inference script for vendor scoring
"""

import joblib
import numpy as np
import json

class VendorScorer:
    def __init__(self, model_path='models/vendor_scoring_model.pkl', 
                 scaler_path='models/feature_scaler.pkl'):
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)
    
    def score_vendor(self, features):
        """
        Score a vendor based on features
        
        Args:
            features: dict with keys matching training features
        
        Returns:
            dict with score and explanation
        """
        # Convert to array in correct order
        feature_array = np.array([
            features.get('avg_delivery_success', 80),
            features.get('avg_quality_score', 80),
            features.get('avg_cost_efficiency', 75),
            features.get('avg_compliance_score', 90),
            features.get('avg_contract_value', 100000),
            features.get('total_projects', 5),
            features.get('incident_rate', 0.5),
            features.get('avg_response_time', 24),
            features.get('avg_external_rating', 4.0),
            features.get('total_reviews', 100),
            features.get('cert_count', 3),
            features.get('years_in_business', 10),
            features.get('team_size', 50),
            features.get('high_risk_incidents', 0),
            features.get('compliance_issues', 0),
        ]).reshape(1, -1)
        
        # Scale features
        scaled_features = self.scaler.transform(feature_array)
        
        # Predict
        score = self.model.predict(scaled_features)[0]
        
        # Get feature importance if available
        try:
            importance = dict(zip(
                ['delivery', 'quality', 'cost', 'compliance', 'contract_value',
                 'projects', 'incidents', 'response', 'rating', 'reviews',
                 'certs', 'years', 'team', 'risks', 'compliance_issues'],
                self.model.feature_importances_
            ))
        except:
            importance = {}
        
        return {
            'score': float(score),
            'feature_importance': importance,
            'recommendation': 'Recommended' if score >= 75 else 'Review Required' if score >= 60 else 'Not Recommended'
        }

# Example usage
if __name__ == "__main__":
    scorer = VendorScorer()
    
    test_vendor = {
        'avg_delivery_success': 92,
        'avg_quality_score': 88,
        'avg_cost_efficiency': 85,
        'avg_compliance_score': 95,
        'avg_contract_value': 200000,
        'total_projects': 8,
        'incident_rate': 0.2,
        'avg_response_time': 12,
        'avg_external_rating': 4.5,
        'total_reviews': 250,
        'cert_count': 5,
        'years_in_business': 15,
        'team_size': 120,
        'high_risk_incidents': 0,
        'compliance_issues': 0,
    }
    
    result = scorer.score_vendor(test_vendor)
    print(json.dumps(result, indent=2))
