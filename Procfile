release: cd nanevida-backend && python create_superuser.py
web: cd nanevida-backend && gunicorn nane.wsgi:application --bind 0.0.0.0:$PORT --workers 4
