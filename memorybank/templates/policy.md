# Memory Bank Update Policy

## Periodic & Systematic Maintenance

Always keep the following files current in the Litigation Reports System:

### Core Files to Maintain

#### `memorybank/DecisionLog.md`
- **Purpose**: Chronological decisions with date, context, links to PRs/commits
- **Update Trigger**: On every architectural decision, major feature completion
- **Content**: Date, decision summary, context, cross-references to evidence
- **Format**: Arabic-first context, terse entries with links

#### `memorybank/Progress.md`
- **Purpose**: Short status per development run
- **Update Trigger**: Daily during active development, on every PR merge
- **Content**: Test health (Playwright/axe), screenshots updated, notable fixes
- **Format**: Brief daily entries with completion status

#### `memorybank/UI-Rules-RTL.md`
- **Purpose**: Authoritative RTL/i18n rules and guidelines
- **Update Trigger**: When RTL/UI patterns change or new components added
- **Content**: Complete bilingual UI guidelines, CSS patterns, accessibility rules
- **Format**: Technical documentation with code examples

#### Template Files
- `memorybank/templates/adr-template.md` - ADR skeleton using Nygard format
- `memorybank/templates/pr-template.md` - PR checklist with RTL requirements
- `memorybank/templates/release-template.md` - Release notes template
- `memorybank/templates/policy.md` - This policy document

## Update Methodology

### How to Update
1. **Use Memory Bank MCP**: Read existing files, append/modify content
2. **Parse Git Log**: Check recent commits since last update for relevant changes
3. **Summarize Context**: Arabic-first context, keep entries terse
4. **Link Evidence**: Include PR/commit references for traceability

### When Updates Happen
- **On every merge to main** via CI automation
- **Daily schedule** via Windows Task Scheduler during active development
- **Manual updates** when significant architectural decisions are made
- **Before PR creation** to ensure current state is documented

### Update Process
```bash
# 1. Check git log for changes since last update
git log --since="2025-09-16" --oneline --grep="feat\|fix\|chore"

# 2. Update relevant memory bank files via MCP
# 3. Commit changes with descriptive message
git add memorybank/
git commit -m "chore(memorybank): update DecisionLog with server pagination decision"
```

## Windows-Specific Implementation

### Path Handling
- Use forward slashes `/` in paths: `memorybank/templates/policy.md`
- In JSON configs, escape backslashes: `"D:\\Claude\\Litigation_Reports\\memorybank\\"`
- PowerShell commands: `New-Item -ItemType Directory -Path memorybank/templates`

### File Operations
```powershell
# Create directory if missing
New-Item -ItemType Directory -Path memorybank/templates -Force

# Check file existence
Test-Path memorybank/DecisionLog.md

# Read file content for updating
Get-Content memorybank/Progress.md
```

### Encoding Standards
- **UTF-8**: All files must use UTF-8 encoding
- **Line Endings**: Windows CRLF (`\r\n`) acceptable
- **Arabic Text**: Ensure proper Unicode handling for Arabic content

## Automation Requirements

### CI/CD Integration
- **Pre-commit**: Validate memory bank files exist and are well-formed
- **Post-merge**: Update DecisionLog.md with merge summary
- **Daily Task**: Update Progress.md with test results and status

### Task Scheduler (Windows)
```xml
<!-- Daily at 6 PM during development cycles -->
<Task>
  <Triggers>
    <CalendarTrigger>
      <StartBoundary>2025-09-17T18:00:00</StartBoundary>
      <DaysInterval>1</DaysInterval>
    </CalendarTrigger>
  </Triggers>
  <Actions>
    <Exec>
      <Command>claude</Command>
      <Arguments>memorybank update --daily</Arguments>
    </Exec>
  </Actions>
</Task>
```

### Validation Rules
- **Markdown Linting**: All .md files must pass markdown lint
- **Link Validation**: Cross-references must point to valid files/commits
- **Date Format**: Consistent YYYY-MM-DD format in entries
- **Arabic Content**: Proper RTL text rendering validation

## Error Handling

### Missing Files
If core memory bank files are missing:
1. Create from templates with initial content
2. Log restoration in Progress.md
3. Commit with `chore(memorybank): restore missing files`

### Update Failures
If automatic update fails:
1. Write error note to Progress.md
2. Exit with non-zero status in CI
3. Alert development team for manual intervention
4. **Never**: Overwrite history or force-push

### Conflict Resolution
- Manual review required for merge conflicts in memory bank files
- Preserve chronological order in DecisionLog.md
- Append conflicting entries rather than overwrite

## Quality Standards

### Content Requirements
- **DecisionLog.md**: Must include date, context, impact, cross-references
- **Progress.md**: Brief, actionable status updates with metrics
- **UI-Rules-RTL.md**: Technical accuracy with code examples

### Commit Message Format
```
chore(memorybank): [action] [file] - [brief description]

Examples:
chore(memorybank): update DecisionLog with pagination decision
chore(memorybank): add daily progress for 2025-09-17
chore(memorybank): restore missing template files
```

### Review Process
- Memory bank updates require same review as code changes
- Focus on accuracy, completeness, and proper cross-referencing
- Ensure Arabic content is properly formatted and contextually accurate

## Enforcement Mechanisms

### Automated Checks
- **File Existence**: Verify all core files present
- **Format Validation**: Markdown lint, date format consistency
- **Link Integrity**: Validate internal and external references
- **Encoding Check**: UTF-8 compliance for all files

### Manual Verification
- Weekly review of DecisionLog.md for completeness
- Monthly audit of UI-Rules-RTL.md against actual implementation
- Quarterly template update review

### Compliance Metrics
- **Update Frequency**: Daily Progress.md updates during active development
- **Decision Coverage**: All architectural decisions documented within 24 hours
- **Cross-Reference Integrity**: 100% of links must be valid
- **Template Currency**: Templates reviewed and updated quarterly

---

**Policy Version**: 1.0
**Effective Date**: 2025-09-17
**Review Schedule**: Quarterly
**Owner**: Development Team