release: cd nanevida-backend && python verify_db_url.py && python manage.py collectstatic --noinput && python manage.py migrate --noinput && python create_superuser.py
web: cd nanevida-backend && python verify_db_url.py && gunicorn nane.wsgi:application --bind 0.0.0.0:$PORT --workers 4
