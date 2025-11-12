"""
ML Model Training Script for Vendor Scoring
This script trains machine learning models to predict vendor performance scores
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import json
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Configuration
MODEL_VERSION = 'v1.0.0'
MODEL_PATH = 'models/vendor_scoring_model.pkl'
SCALER_PATH = 'models/feature_scaler.pkl'
METADATA_PATH = 'models/model_metadata.json'

def load_data(csv_path='data/vendor_training_data.csv'):
    """Load and prepare training data"""
    print("Loading training data...")
    df = pd.read_csv(csv_path)
    return df

def engineer_features(df):
    """Create features for ML model"""
    print("Engineering features...")
    
    features = pd.DataFrame()
    
    # Performance metrics
    features['avg_delivery_success'] = df.groupby('vendor_id')['delivery_success_rate'].transform('mean')
    features['avg_quality_score'] = df.groupby('vendor_id')['quality_score'].transform('mean')
    features['avg_cost_efficiency'] = df.groupby('vendor_id')['cost_efficiency'].transform('mean')
    features['avg_compliance_score'] = df.groupby('vendor_id')['compliance_score'].transform('mean')
    
    # Project complexity indicators
    features['avg_contract_value'] = df.groupby('vendor_id')['contract_value'].transform('mean')
    features['total_projects'] = df.groupby('vendor_id')['vendor_id'].transform('count')
    features['incident_rate'] = df.groupby('vendor_id')['incident_count'].transform('mean')
    
    # Time-based features
    features['avg_response_time'] = df.groupby('vendor_id')['response_time_hours'].transform('mean')
    
    # External review features
    features['avg_external_rating'] = df.groupby('vendor_id')['external_rating'].transform('mean')
    features['total_reviews'] = df.groupby('vendor_id')['review_count'].transform('sum')
    
    # Capability features
    features['cert_count'] = df.groupby('vendor_id')['certification_count'].transform('max')
    features['years_in_business'] = df.groupby('vendor_id')['years_in_business'].transform('max')
    features['team_size'] = df.groupby('vendor_id')['team_size'].transform('max')
    
    # Risk indicators
    features['high_risk_incidents'] = df.groupby('vendor_id')['high_risk_flag'].transform('sum')
    features['compliance_issues'] = df.groupby('vendor_id')['compliance_issue'].transform('sum')
    
    # Target variable: Overall vendor score
    target = (
        df['delivery_success_rate'] * 0.35 +
        df['quality_score'] * 0.25 +
        df['cost_efficiency'] * 0.20 +
        df['compliance_score'] * 0.10 +
        df['external_rating'] * 20 * 0.10  # Convert 0-5 to 0-100
    )
    
    return features, target

def train_model(X, y):
    """Train the vendor scoring model"""
    print("\nTraining model...")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest model
    print("Training Random Forest...")
    rf_model = RandomForestRegressor(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    rf_model.fit(X_train_scaled, y_train)
    
    # Train Gradient Boosting model
    print("Training Gradient Boosting...")
    gb_model = GradientBoostingRegressor(
        n_estimators=150,
        max_depth=5,
        learning_rate=0.1,
        random_state=42
    )
    gb_model.fit(X_train_scaled, y_train)
    
    # Evaluate both models
    print("\nEvaluating models...")
    rf_pred = rf_model.predict(X_test_scaled)
    gb_pred = gb_model.predict(X_test_scaled)
    
    rf_rmse = np.sqrt(mean_squared_error(y_test, rf_pred))
    gb_rmse = np.sqrt(mean_squared_error(y_test, gb_pred))
    
    rf_r2 = r2_score(y_test, rf_pred)
    gb_r2 = r2_score(y_test, gb_pred)
    
    rf_mae = mean_absolute_error(y_test, rf_pred)
    gb_mae = mean_absolute_error(y_test, gb_pred)
    
    print(f"Random Forest - RMSE: {rf_rmse:.2f}, R²: {rf_r2:.3f}, MAE: {rf_mae:.2f}")
    print(f"Gradient Boosting - RMSE: {gb_rmse:.2f}, R²: {gb_r2:.3f}, MAE: {gb_mae:.2f}")
    
    # Select best model
    if rf_r2 > gb_r2:
        print("\nRandom Forest selected as best model")
        best_model = rf_model
        best_score = rf_r2
        model_type = "RandomForest"
    else:
        print("\nGradient Boosting selected as best model")
        best_model = gb_model
        best_score = gb_r2
        model_type = "GradientBoosting"
    
    # Cross-validation
    cv_scores = cross_val_score(best_model, X_train_scaled, y_train, cv=5, 
                                 scoring='r2', n_jobs=-1)
    print(f"Cross-validation R² scores: {cv_scores}")
    print(f"Mean CV R²: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 10 Feature Importances:")
    print(feature_importance.head(10))
    
    return best_model, scaler, {
        'model_type': model_type,
        'r2_score': float(best_score),
        'rmse': float(rf_rmse if model_type == "RandomForest" else gb_rmse),
        'mae': float(rf_mae if model_type == "RandomForest" else gb_mae),
        'cv_mean': float(cv_scores.mean()),
        'cv_std': float(cv_scores.std()),
        'feature_importance': feature_importance.to_dict('records')[:20]
    }

def save_model(model, scaler, metrics):
    """Save trained model and metadata"""
    print("\nSaving model...")
    
    # Save model
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")
    
    # Save scaler
    joblib.dump(scaler, SCALER_PATH)
    print(f"Scaler saved to {SCALER_PATH}")
    
    # Save metadata
    metadata = {
        'version': MODEL_VERSION,
        'trained_at': datetime.now().isoformat(),
        'metrics': metrics
    }
    
    with open(METADATA_PATH, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"Metadata saved to {METADATA_PATH}")

def generate_sample_data():
    """Generate sample training data for demonstration"""
    print("Generating sample training data...")
    
    np.random.seed(42)
    n_vendors = 50
    n_projects_per_vendor = np.random.randint(2, 10, n_vendors)
    
    data = []
    for vendor_id in range(n_vendors):
        base_quality = np.random.uniform(60, 95)
        
        for _ in range(n_projects_per_vendor[vendor_id]):
            data.append({
                'vendor_id': f'VENDOR_{vendor_id:03d}',
                'delivery_success_rate': np.clip(np.random.normal(base_quality, 10), 50, 100),
                'quality_score': np.clip(np.random.normal(base_quality, 8), 50, 100),
                'cost_efficiency': np.clip(np.random.normal(base_quality - 5, 12), 40, 100),
                'compliance_score': np.clip(np.random.normal(90, 5), 70, 100),
                'contract_value': np.random.uniform(50000, 500000),
                'response_time_hours': np.random.uniform(1, 48),
                'incident_count': np.random.poisson(1),
                'external_rating': np.clip(np.random.normal(4.2, 0.5), 2.5, 5.0),
                'review_count': np.random.randint(10, 500),
                'certification_count': np.random.randint(1, 8),
                'years_in_business': np.random.randint(3, 25),
                'team_size': np.random.randint(10, 500),
                'high_risk_flag': 1 if np.random.random() < 0.15 else 0,
                'compliance_issue': 1 if np.random.random() < 0.1 else 0,
            })
    
    df = pd.DataFrame(data)
    df.to_csv('data/vendor_training_data.csv', index=False)
    print(f"Generated {len(df)} training samples for {n_vendors} vendors")
    return df

def main():
    """Main training pipeline"""
    print("=" * 60)
    print("Vendor Scoring ML Model Training Pipeline")
    print("=" * 60)
    
    # Generate or load data
    try:
        df = load_data()
    except FileNotFoundError:
        print("Training data not found. Generating sample data...")
        df = generate_sample_data()
    
    # Engineer features
    X, y = engineer_features(df)
    
    print(f"\nFeature matrix shape: {X.shape}")
    print(f"Target vector shape: {y.shape}")
    
    # Train model
    model, scaler, metrics = train_model(X, y)
    
    # Save model
    save_model(model, scaler, metrics)
    
    print("\n" + "=" * 60)
    print("Training completed successfully!")
    print("=" * 60)
    print(f"\nModel Performance:")
    print(f"  R² Score: {metrics['r2_score']:.3f}")
    print(f"  RMSE: {metrics['rmse']:.2f}")
    print(f"  MAE: {metrics['mae']:.2f}")
    print(f"\nModel ready for deployment!")

if __name__ == "__main__":
    main()
