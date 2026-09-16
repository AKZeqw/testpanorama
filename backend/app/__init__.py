from flask import Flask, jsonify
from flask_cors import CORS
from .config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS for frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    from .routes.cases import cases_bp
    from .routes.scenes import scenes_bp
    from .routes.evidences import evidences_bp
    from .routes.suspects import suspects_bp
    from .routes.investigations import investigations_bp
    from .routes.auth import auth_bp

    app.register_blueprint(cases_bp)
    app.register_blueprint(scenes_bp)
    app.register_blueprint(evidences_bp)
    app.register_blueprint(suspects_bp)
    app.register_blueprint(investigations_bp)
    app.register_blueprint(auth_bp)

    @app.route('/health')
    def health_check():
        return jsonify({
            'status': 'ok',
            'message': 'Crime Investigation API running',
            'endpoints': [
                '/api/cases',
                '/api/scenes',
                '/api/evidences',
                '/api/suspects',
                '/api/investigations',
                '/api/auth'
            ]
        })

    return app

