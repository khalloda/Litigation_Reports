/**
 * Utilities for handling mixed Arabic/English content
 * Provides functions to determine text direction and handle mixed content
 */

export type TextDirection = 'ltr' | 'rtl' | 'auto';

/**
 * Determines the text direction based on the first character
 * @param text - The text to analyze
 * @returns 'ltr' for Latin characters, 'rtl' for Arabic/Hebrew characters
 */
export function getTextDirection(text: string): TextDirection {
  if (!text || text.length === 0) return 'auto';

  const firstChar = text.charAt(0);

  // Arabic Unicode ranges
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

  // Hebrew Unicode ranges
  const hebrewRegex = /[\u0590-\u05FF\u200F\u202B\u202D\u202E\u202C\u202A\u2028\u2029]/;

  if (arabicRegex.test(firstChar) || hebrewRegex.test(firstChar)) {
    return 'rtl';
  }

  // Latin characters
  const latinRegex = /[a-zA-Z0-9]/;
  if (latinRegex.test(firstChar)) {
    return 'ltr';
  }

  return 'auto';
}

/**
 * Checks if text contains mixed Arabic and Latin characters
 * @param text - The text to check
 * @returns true if text contains both Arabic and Latin characters
 */
export function hasMixedContent(text: string): boolean {
  if (!text || text.length === 0) return false;

  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const latinRegex = /[a-zA-Z0-9]/;

  const hasArabic = arabicRegex.test(text);
  const hasLatin = latinRegex.test(text);

  return hasArabic && hasLatin;
}

/**
 * Splits mixed content into segments with their respective directions
 * @param text - The text to segment
 * @returns Array of segments with direction information
 */
export function segmentMixedContent(text: string): Array<{
  text: string;
  direction: TextDirection;
  isArabic: boolean;
  isLatin: boolean;
}> {
  if (!text || text.length === 0) return [];

  const segments: Array<{
    text: string;
    direction: TextDirection;
    isArabic: boolean;
    isLatin: boolean;
  }> = [];

  let currentSegment = '';
  let currentDirection: TextDirection | null = null;

  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const latinRegex = /[a-zA-Z0-9]/;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isArabic = arabicRegex.test(char);
    const isLatin = latinRegex.test(char);

    let charDirection: TextDirection;

    if (isArabic) {
      charDirection = 'rtl';
    } else if (isLatin) {
      charDirection = 'ltr';
    } else {
      charDirection = 'auto';
    }

    // If direction changes or we encounter a space, create a new segment
    if (currentDirection && currentDirection !== charDirection && charDirection !== 'auto') {
      if (currentSegment.trim()) {
        segments.push({
          text: currentSegment,
          direction: currentDirection,
          isArabic: currentDirection === 'rtl',
          isLatin: currentDirection === 'ltr',
        });
      }
      currentSegment = char;
      currentDirection = charDirection;
    } else {
      currentSegment += char;
      if (currentDirection === null || currentDirection === 'auto') {
        currentDirection = charDirection;
      }
    }
  }

  // Add the last segment
  if (currentSegment.trim()) {
    segments.push({
      text: currentSegment,
      direction: currentDirection || 'auto',
      isArabic: currentDirection === 'rtl',
      isLatin: currentDirection === 'ltr',
    });
  }

  return segments;
}

/**
 * Gets the appropriate dir attribute value for an input field
 * @param fieldType - The type of field (email, url, etc.)
 * @param defaultValue - The default value of the field
 * @returns 'ltr' for Latin-only fields, 'auto' for mixed content fields
 */
export function getInputDirection(fieldType: string, defaultValue?: string): TextDirection {
  // Fields that should always be LTR
  const ltrFields = ['email', 'url', 'tel', 'password'];

  if (ltrFields.includes(fieldType)) {
    return 'ltr';
  }

  // For other fields, use auto to let browser determine direction
  return 'auto';
}

/**
 * Formats text for display with proper direction handling
 * @param text - The text to format
 * @param options - Formatting options
 * @returns Formatted text with direction information
 */
export function formatTextWithDirection(
  text: string,
  options: {
    preserveWhitespace?: boolean;
    maxLength?: number;
    ellipsis?: string;
  } = {}
): {
  text: string;
  direction: TextDirection;
  isMixed: boolean;
} {
  const { preserveWhitespace = true, maxLength, ellipsis = '...' } = options;

  let processedText = text;

  if (!preserveWhitespace) {
    processedText = processedText.trim().replace(/\s+/g, ' ');
  }

  if (maxLength && processedText.length > maxLength) {
    processedText = processedText.substring(0, maxLength) + ellipsis;
  }

  const direction = getTextDirection(processedText);
  const isMixed = hasMixedContent(processedText);

  return {
    text: processedText,
    direction,
    isMixed,
  };
}

/**
 * React hook for managing text direction in components
 * @param initialText - Initial text value
 * @returns Object with text direction utilities
 */
export function useTextDirection(initialText: string = '') {
  const [text, setText] = React.useState(initialText);

  const direction = getTextDirection(text);
  const isMixed = hasMixedContent(text);
  const segments = segmentMixedContent(text);

  return {
    text,
    setText,
    direction,
    isMixed,
    segments,
    getInputDirection: (fieldType: string) => getInputDirection(fieldType, text),
  };
}

// Import React for the hook
import React from 'react';
