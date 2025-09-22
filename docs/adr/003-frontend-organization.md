# ADR-003: Frontend Service Organization

## Status
**Accepted**

## Context
Frontend assets and source code are currently scattered across multiple locations:
- `src/` for React source code
- `backend/public/assets/` for compiled assets
- `backend/public/` for mixed content

This makes it difficult to deploy the frontend independently and unclear where build artifacts belong.

## Decision
We will organize the frontend into a clear `/apps/web/` service structure with separated source code and build artifacts.

## Rationale
1. **Service Boundaries**: Clear separation between frontend and backend
2. **Build Artifact Management**: Separate source and compiled assets
3. **Independent Deployment**: Frontend can be deployed separately
4. **12-Factor Compliance**: Clear build and run stages
5. **Scalability**: Frontend service can be scaled independently

## Consequences
### Positive
- **Clear Boundaries**: Obvious separation of concerns
- **Independent Deployment**: Frontend and backend can be deployed separately
- **Build Optimization**: Clear build artifact locations
- **Development Workflow**: Simpler frontend development
- **CDN Ready**: Easy to serve static assets

### Negative
- **Path Changes**: All import paths need updates
- **Build Script Updates**: Vite config needs new paths
- **Deployment Changes**: Update deployment scripts for new structure

## Implementation Plan
1. **Phase 1**: Create new `/apps/web/` directory structure
2. **Phase 2**: Move frontend source:
   - Move `src/` → `/apps/web/src/`
   - Move `index.html` → `/apps/web/public/index.html`
   - Move `backend/public/assets/` → `/apps/web/public/assets/`
3. **Phase 3**: Update build configuration:
   - Update `vite.config.ts` for new paths
   - Update `package.json` scripts
   - Update `tsconfig.json` paths
4. **Phase 4**: Update all import statements
5. **Phase 5**: Test build and deployment process

## Directory Structure
```
/apps/web/
├── src/                    # React source code
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom hooks
│   ├── services/         # API services
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── styles/           # Stylesheets
├── public/               # Static assets
│   ├── index.html       # HTML entry point
│   ├── assets/          # Compiled assets
│   └── favicon.ico      # Favicon
├── package.json         # Frontend dependencies
├── vite.config.ts       # Build configuration
├── tsconfig.json        # TypeScript configuration
└── README.md            # Frontend documentation
```

## Build Process
1. **Development**: `npm run dev` serves from `/apps/web/src/`
2. **Production Build**: `npm run build` outputs to `/apps/web/dist/`
3. **Preview**: `npm run preview` serves built files
4. **Static Assets**: Served from `/apps/web/public/`

## Alternatives Considered
1. **Keep Current Structure**: Rejected due to organizational issues
2. **Monorepo with Packages**: Considered but rejected for complexity
3. **Separate Repository**: Rejected due to tight coupling with backend

## Related ADRs
- ADR-001: API Consolidation
- ADR-004: Deployment Strategy

## Compliance
- ✅ 12-Factor App: Clear build and run stages
- ✅ Modern Frontend Practices: Standard React project structure
- ✅ Independent Deployment: Frontend can be deployed separately

---
**ADR Created**: January 22, 2025
**Decision Date**: January 22, 2025
**Status**: Accepted
**Author**: Principal Software Architect
