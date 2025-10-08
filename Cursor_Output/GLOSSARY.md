# Glossary

## 📚 Purpose

This glossary defines key domain terms, technical acronyms, legal terminology, and system-specific jargon used throughout the Litigation Management System codebase and documentation.

---

## 🏛️ Legal & Domain Terms

### Case Management Terms

| Term | Definition | Arabic Equivalent | Evidence |
|------|------------|-------------------|----------|
| **Case (Dava)** | A legal matter or lawsuit filed with a court | دعوى (Dava) | `database/litigation_database.sql:L100` |
| **Hearing (Jalsa)** | A court session or proceeding | جلسة (Jalsa) | `database/litigation_database.sql:L151` |
| **Client** | A person or organization receiving legal services | عميل (Ameel) | `database/litigation_database.sql:L56` |
| **Lawyer (Muhami)** | Legal professional representing clients | محامي (Muhami) | `database/litigation_database.sql:L75` |
| **Invoice (Fatura)** | Bill for legal services rendered | فاتورة (Fatura) | `database/litigation_database.sql:L223` |
| **Document (Watheeqa)** | Legal paperwork or evidence | وثيقة (Watheeqa) | `database/litigation_database.sql:L200` |
| **Power of Attorney (Tawkeel)** | Legal authorization to represent someone | توكيل (Tawkeel) | `database/litigation_database.sql:L175` |
| **Plaintiff (Mudda'i)** | Party bringing a lawsuit | مُدَّعِي (Mudda'i) | Case management context |
| **Defendant (Mudda'a Alayh)** | Party being sued | مُدَّعَى عليه (Mudda'a Alayh) | Case management context |

### Case Types & Classifications

| Term | Definition | Arabic | Evidence |
|------|------------|--------|----------|
| **Civil Case** | Non-criminal legal dispute | دعوى مدنية (Dava Madaniyya) | `backend/config/config.php:L109` |
| **Criminal Case** | Prosecution for alleged crime | دعوى جنائية (Dava Jina'iyya) | `backend/config/config.php:L110` |
| **Commercial Case** | Business/trade dispute | دعوى تجارية (Dava Tijariyya) | `backend/config/config.php:L111` |
| **Family Law Case** | Domestic relations matter | دعوى أسرية (Dava Usariyya) | `backend/config/config.php:L112` |

### Case Status Terms

| Term | Definition | Arabic | Evidence |
|------|------------|--------|----------|
| **Active (Sariya)** | Case is ongoing | سارية (Sariya) | `backend/config/config.php:L103` |
| **Closed (Muntahiya)** | Case is concluded | منتهية (Muntahiya) | `backend/config/config.php:L104` |
| **Suspended (Mu'allaqa)** | Case is on hold | معلقة (Mu'allaqa) | `backend/config/config.php:L105` |

### Hearing Outcomes

| Term | Definition | Arabic | Evidence |
|------|------------|--------|----------|
| **For (Salih)** | Ruling in favor | صالح (Salih) | `backend/config/config.php:L125` |
| **Against (Didd)** | Ruling against | ضد (Didd) | `backend/config/config.php:L126` |
| **Adjourned (Mu'ajjal)** | Postponed to future date | مؤجل (Mu'ajjal) | `backend/config/config.php:L127` |
| **Pending (Qaid al-Nazar)** | Under consideration | قيد النظر (Qaid al-Nazar) | `backend/config/config.php:L128` |

---

## 💻 Technical Terms

### Frontend Technologies

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **SPA** | Single Page Application | React-based frontend | `README.md:L13` |
| **HMR** | Hot Module Replacement | Vite dev server feature | `vite.config.ts:L1` |
| **RTL** | Right-to-Left | Text direction for Arabic | `src/styles/rtl.scss` |
| **LTR** | Left-to-Right | Text direction for English | Opposite of RTL |
| **SSR** | Server-Side Rendering | Not used (CSR only) | Analysis |
| **CSR** | Client-Side Rendering | React renders in browser | Vite SPA approach |
| **i18n** | Internationalization | Multi-language support (AR/EN) | `src/i18n/` |
| **a11y** | Accessibility | WCAG compliance features | `playwright.config.mjs:L53` |

### Backend Technologies

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **MVC** | Model-View-Controller | Backend architecture pattern | `backend/src/` structure |
| **PDO** | PHP Data Objects | Database abstraction layer | `backend/config/database.php:L14` |
| **JWT** | JSON Web Token | Authentication token format | `backend/src/Core/Auth.php:L267` |
| **HS256** | HMAC-SHA256 | JWT signing algorithm | `backend/config/config.php:L26` |
| **bcrypt** | Blowfish cipher | Password hashing algorithm | `backend/src/Core/Auth.php:L18` |
| **CORS** | Cross-Origin Resource Sharing | Cross-domain API access | `backend/src/Middleware/CorsMiddleware.php` |
| **CSRF** | Cross-Site Request Forgery | Security attack type (protected) | `backend/config/config.production.php:L26` |

### Database Terms

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **UTF-8mb4** | 4-byte UTF-8 encoding | Full Unicode support (emojis, Arabic) | `database/litigation_database.sql:L13` |
| **InnoDB** | MySQL storage engine | Transaction support, foreign keys | `database/litigation_database.sql:L38` |
| **FK** | Foreign Key | Relational constraint | Schema foreign keys |
| **PK** | Primary Key | Unique identifier | Schema primary keys |
| **UK** | Unique Key | Unique constraint | `case_number`, `invoice_number` |
| **INDEX** | Database index | Query performance optimization | Multiple tables |

---

## 🔐 Security & Authentication Terms

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **RBAC** | Role-Based Access Control | Permission system (4 roles) | `backend/config/config.php:L82` |
| **Super Admin** | Highest privilege level | 91 permissions | `backend/config/config.php:L84` |
| **Admin** | Administrator role | 84 permissions | `backend/config/config.php:L89` |
| **Lawyer** | Lawyer user role | 52 permissions | `backend/config/config.php:L92` |
| **Staff** | Staff user role | 52 permissions | `backend/config/config.php:L95` |
| **Session** | Server-side user state | PHP sessions + JWT | `backend/src/Core/Auth.php:L33` |
| **Token** | Authentication credential | JWT bearer token | `backend/src/Core/Auth.php:L29` |
| **Bearer Token** | HTTP Authorization header format | `Authorization: Bearer {token}` | `backend/src/Core/Auth.php:L64` |

---

## 🧪 Testing Terms

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **E2E** | End-to-End testing | Playwright tests (140+ files) | `tests/` directory |
| **Unit Test** | Isolated component testing | Vitest framework | `vitest.config.ts` |
| **Integration Test** | Multi-component testing | API tests | `tests/api/` |
| **Spec** | Test specification file | `.spec.ts` or `.spec.js` | Test file naming |
| **Fixture** | Test data/setup | Pre-defined test data | `tests/fixtures/` |
| **Mock** | Simulated dependency | Test doubles | Various test files |

---

## 📦 Build & Deployment Terms

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **Vite** | Build tool | Frontend bundler | `vite.config.ts` |
| **Tree Shaking** | Dead code elimination | Vite optimization | Vite default |
| **Code Splitting** | Bundle chunking | `manualChunks` config | `vite.config.ts:L50` |
| **Source Map** | Debug mapping | `.map` files | `vite.config.ts:L46` |
| **Minification** | Code size reduction | Production builds | Vite default |
| **FTP** | File Transfer Protocol | GoDaddy deployment | `scripts/deploy-to-godaddy.sh` |

---

## 🌐 API & Protocol Terms

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **REST** | Representational State Transfer | API architecture | `backend/api/index.php` |
| **JSON** | JavaScript Object Notation | API data format | All API responses |
| **HTTP** | Hypertext Transfer Protocol | Communication protocol | Web standard |
| **HTTPS** | HTTP Secure | Encrypted HTTP | Production config |
| **GET/POST/PUT/DELETE** | HTTP methods | CRUD operations | API router |
| **Status Code** | HTTP response code | 200, 201, 404, 500, etc. | API responses |
| **Endpoint** | API URL path | `/api/cases`, `/api/auth/login` | API routes |

---

## 💼 Business Logic Terms

| Term | Definition | Arabic | Evidence |
|------|------------|--------|----------|
| **Cash Client** | Paying client | عميل نقدي | `backend/config/config.php:L*` |
| **Pro Bono** | Free legal service | مجاني / خيري | Client types |
| **Work Team** | Group of lawyers | فريق عمل | `database/litigation_database.sql:L88` |
| **Lawyer Share** | Percentage of invoice | حصة المحامي | `database/litigation_database.sql:L246` |
| **VAT** | Value Added Tax | ضريبة القيمة المضافة | Invoice calculations |
| **Contract ID** | Service agreement reference | رقم العقد | Invoice relation |
| **Case Number** | Unique case identifier | رقم الدعوى | Case tracking |
| **Court Name** | Judicial venue | اسم المحكمة | Hearing location |

---

## 📊 Data & Reporting Terms

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **Pagination** | Page-by-page data loading | Server-side pagination | `backend/config/database.php:L143` |
| **Page Size** | Records per page | Default: 20, Max: 100 | `backend/config/config.php:L48-L49` |
| **Sorting** | Data ordering | Table column sorting | UI components |
| **Filtering** | Data subsetting | Search and filter | UI components |
| **PDF Export** | Document generation | jsPDF library | `package.json:L116` |
| **Auto-Table** | PDF table plugin | jspdf-autotable | `package.json:L117` |
| **Dashboard** | Summary view | Main analytics page | `src/pages/Dashboard.tsx` |

---

## 🔄 State Management Terms

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **Context** | React global state | AuthContext | `src/contexts/AuthContext.tsx` |
| **Hook** | React state function | `useState`, `useEffect`, custom hooks | `src/hooks/` |
| **Query** | Data fetching | React Query | `package.json:L128` |
| **Mutation** | Data modification | React Query mutations | API service |
| **Cache** | Stored data | React Query cache + file cache | Multiple layers |
| **localStorage** | Browser storage | Token, language preference | `src/services/api.ts:L96` |

---

## 🎨 UI/UX Terms

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **Modal** | Popup dialog | CRUD modals | `src/components/modals/` |
| **Toast** | Notification popup | Success/error messages | `package.json:L126` (react-hot-toast) |
| **Dropdown** | Selection component | React Select | `package.json:L130` |
| **Datepicker** | Date input | React Datepicker | `package.json:L122` |
| **Navbar** | Navigation bar | Top menu | `src/components/layout/Navbar.tsx` |
| **Sidebar** | Side navigation | Left/right menu (RTL-aware) | `src/components/layout/Sidebar.tsx` |
| **Layout** | Page structure | Wrapper component | `src/components/layout/Layout.tsx` |
| **Theme** | Visual style | Bootstrap + custom | `src/styles/` |

---

## 📱 Responsive & Mobile Terms

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **Breakpoint** | Screen size threshold | Bootstrap grid system | Bootstrap default |
| **Mobile-First** | Design approach | Responsive design | Bootstrap pattern |
| **Viewport** | Visible browser area | Meta viewport tag | `index.html` |
| **Touch** | Mobile interaction | Touch-friendly UI | Design consideration |

---

## 🔧 Configuration Terms

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **ENV** | Environment variables | Development config | `backend/config/config.php` |
| **Debug Mode** | Development flag | `APP_DEBUG = true` | `backend/config/config.php:L12` |
| **Production** | Live environment | GoDaddy hosting | `backend/config/config.production.php` |
| **Development** | Local environment | localhost setup | `backend/config/config.php` |
| **Feature Flag** | Conditional feature | Production features | `backend/config/config.production.php:L85` |
| **Timezone** | Time offset | UTC+3 (Riyadh/Cairo) | `backend/config/database.php:L27` |

---

## 🌍 Internationalization Terms

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **Locale** | Language/region code | `ar-SA`, `en-US` | `src/i18n/index.ts:L18` |
| **Translation Key** | i18n identifier | `auth.login`, `cases.title` | Translation files |
| **Fallback Language** | Default when missing | Arabic (ar) | `src/i18n/index.ts:L19` |
| **Mixed Content** | Multi-directional text | Arabic + English in same field | `src/components/forms/MixedContentInput.tsx` |
| **Collation** | Text sorting rules | `utf8mb4_unicode_ci` | Database config |

---

## 📈 Performance Terms

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **Lazy Loading** | Deferred loading | React.lazy (implied) | Best practice |
| **Memoization** | Result caching | React Query caching | `package.json:L128` |
| **Debouncing** | Event throttling | Search input optimization | Common pattern |
| **Connection Pooling** | Reusable DB connections | PDO persistent connections | `backend/config/database.php:L21` |
| **Bundle Size** | JavaScript file size | Vite optimization | Build output |

---

## 🔗 Integration Terms

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **API Client** | HTTP request library | Axios | `package.json:L110` |
| **Base URL** | API root path | `/api` or configured | `src/services/api.ts:L8` |
| **Interceptor** | Request/response middleware | Axios interceptors | `src/services/api.ts` |
| **Timeout** | Request time limit | 10 seconds | `src/services/api.ts:L11` |

---

## 🏗️ Infrastructure Terms

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **Shared Hosting** | Multi-tenant server | GoDaddy plan | `README.md:L360` |
| **Apache** | Web server | Production environment | GoDaddy default |
| **LiteSpeed** | Web server alternative | Possible GoDaddy option | GoDaddy offering |
| **PHP-FPM** | FastCGI Process Manager | PHP runtime | GoDaddy standard |
| **Virtual Host** | Site configuration | Apache vhost | Web server concept |
| **cPanel** | Hosting control panel | GoDaddy interface | Standard for GoDaddy |

---

## 📝 File & Data Terms

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **Upload** | File transfer to server | Document/logo uploads | `backend/uploads/` |
| **Mime Type** | File format identifier | File validation | Upload security |
| **Blob** | Binary large object | PDF generation output | jsPDF usage |
| **Base64** | Binary-to-text encoding | Logo embedding in PDFs | PDF export |

---

## 🔍 Search & Query Terms

| Term | Definition | Usage in Project | Evidence |
|------|------------|------------------|----------|
| **LIKE** | SQL pattern matching | Text search | Database class |
| **Wildcard** | Pattern character | `%` in LIKE queries | `backend/config/database.php:L182` |
| **JOIN** | SQL table combination | Relational queries | Report queries |
| **WHERE** | SQL filter clause | Query conditions | All DB queries |
| **ORDER BY** | SQL sorting | Result ordering | Query patterns |
| **LIMIT/OFFSET** | SQL pagination | Page control | `backend/config/database.php:L153` |

---

## 🎯 Acronyms & Abbreviations

| Acronym | Full Form | Context |
|---------|-----------|---------|
| **CRUD** | Create, Read, Update, Delete | Basic operations |
| **ORM** | Object-Relational Mapping | Database abstraction (not used) |
| **DTO** | Data Transfer Object | API responses |
| **API** | Application Programming Interface | Backend endpoints |
| **URL** | Uniform Resource Locator | Web addresses |
| **URI** | Uniform Resource Identifier | API paths |
| **SQL** | Structured Query Language | Database queries |
| **HTML** | Hypertext Markup Language | Web pages |
| **CSS** | Cascading Style Sheets | Styling |
| **JS** | JavaScript | Frontend language |
| **TS** | TypeScript | Type-safe JavaScript |
| **PHP** | PHP: Hypertext Preprocessor | Backend language |
| **NPM** | Node Package Manager | Frontend dependencies |
| **CLI** | Command Line Interface | Terminal commands |
| **UI** | User Interface | Visual components |
| **UX** | User Experience | Interaction design |
| **PR** | Pull Request | Code review (Git) |
| **CI/CD** | Continuous Integration/Deployment | Automation pipeline |
| **SaaS** | Software as a Service | Cloud model |
| **SSL/TLS** | Secure Sockets Layer/Transport Layer Security | Encryption |

---

## 📖 System-Specific Terms

| Term | Definition | Context in Project | Evidence |
|------|------------|-------------------|----------|
| **lit.local** | Development domain | Local dev environment | `vite.config.ts:L15` |
| **lit.sarieldin.com** | Production domain | Live website | `package.json:L152` |
| **litigation_db** | Database name | MySQL database | `backend/config/config.php:L18` |
| **Litigation Management System** | Application name | Full system name | `package.json:L2` |
| **Sarieldin & Associates** | Law firm name | Client organization | PDF branding |
| **Arabic Green/Gold Logo** | Company branding | PDF export theme | Report exports |

---

## 🗂️ Document Cross-References

For more detailed information on specific topics, refer to:

- **Technical Stack:** See [TECH_STACK.md](TECH_STACK.md)
- **Architecture:** See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Database Schema:** See [DATABASE/DB_SCHEMA_MAP.md](DATABASE/DB_SCHEMA_MAP.md)
- **API Endpoints:** See [APIS/ROUTES_AND_ENDPOINTS.md](APIS/ROUTES_AND_ENDPOINTS.md)
- **Security:** See [SECURITY_AND_PRIVACY.md](SECURITY_AND_PRIVACY.md)

---

**Last Updated:** October 7, 2025  
**Audit Version:** 1.0

