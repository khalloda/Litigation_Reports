# Lawyer Name Display Issue Documentation

## Issue Summary
Some lawyer names display as corrupted Arabic characters ("???? ????") instead of proper Arabic text in both the hearings list and form dropdowns.

## Root Cause
This is a **database character encoding issue**, not a code problem. The lawyer records in the database contain corrupted UTF-8 characters for Arabic names.

## Evidence
- **Affected Lawyers**: IDs 6, 29 (Nagy Ramadan, Ahmed Said) and several others
- **Corrupted Data**: `lawyer_name_ar` fields contain "??? ???? ????????" instead of proper Arabic
- **Working Examples**: Newer lawyer records (IDs 39, 40) display correctly as "فاطمة يوسف علي", "محمود عادل إبراهيم"

## Code Solution Implemented
Enhanced the `LawyerMultiSelect` component with intelligent fallback logic:

```typescript
// Helper function to detect corrupted text
const isCorruptedText = (text: string): boolean => {
  return !text || text.includes('????') || text.trim() === '' || /^\s*\?\?\?\?\s*/.test(text);
};

// Smart display name selection
const getDisplayName = (): string => {
  const arName = lawyer.lawyer_name_ar;
  const enName = lawyer.lawyer_name_en;

  if (currentLanguage === 'ar') {
    if (!isCorruptedText(arName)) {
      return enName && !isCorruptedText(enName) ? `${arName} - ${enName}` : arName;
    } else if (!isCorruptedText(enName)) {
      return enName;
    } else {
      return `محامي ${lawyer.id}`;
    }
  } else {
    if (!isCorruptedText(enName)) {
      return enName;
    } else if (!isCorruptedText(arName)) {
      return arName;
    } else {
      return `Lawyer ${lawyer.id}`;
    }
  }
};
```

## Result
- **Before**: "Lawyer 6×Lawyer 29×"
- **After**: "Nagy Ramadan×Ahmed Said×"

## Long-term Solution
To permanently fix this issue, the database needs to be cleaned up with proper UTF-8 encoding for the corrupted lawyer records. This is a database administration task, not a code fix.

## File Locations
- **Component**: `src/components/forms/LawyerMultiSelect.tsx:122-157`
- **Implementation**: Enhanced `getDisplayName()` function with corruption detection