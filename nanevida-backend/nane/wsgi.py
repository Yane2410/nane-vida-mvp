"""
WSGI config for NANE VIDA project.
Compatible with traditional servers and Vercel serverless.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nane.settings')

application = get_wsgi_application()

# Vercel serverless compatibility
app = application
