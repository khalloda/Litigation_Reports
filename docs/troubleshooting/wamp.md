# WAMP PHP Issues Troubleshooting

## Current Issue: PHP Internal Server Error

### Test Steps:
1. Try: `http://lit.local/phpinfo.php`
   - If this fails → PHP configuration issue
   - If this works → API-specific issue

2. Try: `http://lit.local/api/ping.php`
   - Should return JSON with timestamp

### Possible Solutions:

#### Solution 1: Disable fcgid Module (Use Default PHP)
Edit your virtual host to remove fcgid configuration:

```apache
<VirtualHost *:80>
    ServerName lit.local
    DocumentRoot "d:/claude/litigation_reports/backend/public"

    <Directory "d:/claude/litigation_reports/backend/public/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog "logs/lit-error.log"
    CustomLog "logs/lit-access.log" common

    # Remove or comment out the fcgid section
    # <IfModule fcgid_module>
    #     Define FCGIPHPVERSION "8.4.0"
    #     FcgidInitialEnv PHPRC ${PHPROOT}${FCGIPHPVERSION}
    #     <Files ~ "\.php$">
    #         Options +Indexes +Includes +FollowSymLinks +MultiViews +ExecCGI
    #         AddHandler fcgid-script .php
    #         FcgidWrapper "${PHPROOT}${FCGIPHPVERSION}/php-cgi.exe" .php
    #     </Files>
    # </IfModule>
</VirtualHost>
```

#### Solution 2: Fix fcgid PHP Version
The fcgid config mentions PHP 8.4.0 but WAMP might be using 8.3.14. Change:
```apache
Define FCGIPHPVERSION "8.3.14"
```

#### Solution 3: Use localhost Instead
Copy files to WAMP's default directory:
```
Copy: D:\Claude\Litigation_Reports\backend\public\*
To: D:\wamp64\www\litigation\

Copy: D:\Claude\Litigation_Reports\backend\api\*
To: D:\wamp64\www\litigation\api\

Access via: http://localhost/litigation/
```

### Quick Test Commands:
```bash
# Check PHP version
php -v

# Test PHP CLI
php D:\Claude\Litigation_Reports\backend\api\ping.php
```