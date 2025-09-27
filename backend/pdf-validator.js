#!/usr/bin/env node

/**
 * PDF Validation Utility
 * Validates PDF attachment blocks before API calls
 */

const fs = require('fs');

class PDFValidator {
    constructor(pageLimit = 100) {
        this.pageLimit = pageLimit;
    }

    /**
     * Validates a PDF attachment block
     * @param {Object} attachmentBlock - The attachment block to validate
     * @returns {Object} - Validation result with success/error details
     */
    validateAttachment(attachmentBlock) {
        try {
            // Validate schema structure
            const schemaValidation = this.validateSchema(attachmentBlock);
            if (!schemaValidation.valid) {
                return {
                    valid: false,
                    reason: `schema: ${schemaValidation.error}`
                };
            }

            // Validate base64 encoding
            const encodingValidation = this.validateBase64Encoding(attachmentBlock.source.data);
            if (!encodingValidation.valid) {
                return {
                    valid: false,
                    reason: `encoding: ${encodingValidation.error}`
                };
            }

            // Decode and validate PDF structure
            const pdfBytes = Buffer.from(attachmentBlock.source.data, 'base64');
            const structureValidation = this.validatePDFStructure(pdfBytes);
            if (!structureValidation.valid) {
                return {
                    valid: false,
                    reason: `structure: ${structureValidation.error}`
                };
            }

            // Validate size
            const sizeValidation = this.validateSize(pdfBytes);
            if (!sizeValidation.valid) {
                return {
                    valid: false,
                    reason: `size: ${sizeValidation.error}`
                };
            }

            // Validate page count
            const pageValidation = this.validatePageCount(pdfBytes);
            if (!pageValidation.valid) {
                return {
                    valid: false,
                    reason: `pages: ${pageValidation.error}`
                };
            }

            return {
                valid: true,
                size: pdfBytes.length,
                pages: pageValidation.pageCount
            };

        } catch (error) {
            return {
                valid: false,
                reason: `validation_error: ${error.message}`
            };
        }
    }

    /**
     * Validates the attachment block schema
     */
    validateSchema(attachmentBlock) {
        if (!attachmentBlock || typeof attachmentBlock !== 'object') {
            return { valid: false, error: 'attachment block must be an object' };
        }

        if (attachmentBlock.type !== 'document') {
            return { valid: false, error: 'type must be "document"' };
        }

        if (!attachmentBlock.source || typeof attachmentBlock.source !== 'object') {
            return { valid: false, error: 'source must be an object' };
        }

        if (attachmentBlock.source.type !== 'base64') {
            return { valid: false, error: 'source.type must be "base64"' };
        }

        if (attachmentBlock.source.media_type !== 'application/pdf') {
            return { valid: false, error: 'source.media_type must be "application/pdf"' };
        }

        if (!attachmentBlock.source.data || typeof attachmentBlock.source.data !== 'string') {
            return { valid: false, error: 'source.data must be a string' };
        }

        return { valid: true };
    }

    /**
     * Validates base64 encoding
     */
    validateBase64Encoding(base64String) {
        try {
            // Check if string contains only valid base64 characters
            const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
            if (!base64Regex.test(base64String)) {
                return { valid: false, error: 'contains invalid base64 characters' };
            }

            // Try to decode
            const decoded = Buffer.from(base64String, 'base64');

            // Verify it can be re-encoded to the same string
            const reencoded = decoded.toString('base64');
            if (reencoded !== base64String) {
                return { valid: false, error: 'base64 encoding is malformed' };
            }

            return { valid: true };
        } catch (error) {
            return { valid: false, error: `base64 decode failed: ${error.message}` };
        }
    }

    /**
     * Validates PDF file structure
     */
    validatePDFStructure(pdfBytes) {
        if (!pdfBytes || pdfBytes.length === 0) {
            return { valid: false, error: 'PDF data is empty' };
        }

        // Check PDF header
        const header = pdfBytes.slice(0, 5).toString('ascii');
        if (!header.startsWith('%PDF-')) {
            return { valid: false, error: 'does not start with %PDF-' };
        }

        // Check PDF footer
        const footer = pdfBytes.slice(-6).toString('ascii');
        if (!footer.includes('%%EOF')) {
            return { valid: false, error: 'does not end with %%EOF' };
        }

        return { valid: true };
    }

    /**
     * Validates file size
     */
    validateSize(pdfBytes) {
        const maxSize = 50 * 1024 * 1024; // 50MB limit

        if (pdfBytes.length > maxSize) {
            return {
                valid: false,
                error: `file too large: ${pdfBytes.length} bytes (max: ${maxSize})`
            };
        }

        return { valid: true };
    }

    /**
     * Estimates page count from PDF content
     */
    validatePageCount(pdfBytes) {
        try {
            const pdfContent = pdfBytes.toString('latin1');

            // Count /Type /Page entries (most reliable method)
            const pageMatches = pdfContent.match(/\/Type\s*\/Page[^s]/g) || [];
            let pageCount = pageMatches.length;

            // Fallback: count /Page entries if no specific /Type /Page found
            if (pageCount === 0) {
                const pageObjectMatches = pdfContent.match(/\/Page\s/g) || [];
                pageCount = pageObjectMatches.length;
            }

            // Fallback: look for /Count in page tree
            if (pageCount === 0) {
                const countMatch = pdfContent.match(/\/Count\s+(\d+)/);
                if (countMatch) {
                    pageCount = parseInt(countMatch[1]);
                }
            }

            // Default to 1 if we can't determine page count
            if (pageCount === 0) {
                pageCount = 1;
            }

            if (pageCount > this.pageLimit) {
                return {
                    valid: false,
                    error: `too many pages: ${pageCount} (limit: ${this.pageLimit})`
                };
            }

            return { valid: true, pageCount };
        } catch (error) {
            return {
                valid: false,
                error: `page count validation failed: ${error.message}`
            };
        }
    }

    /**
     * Creates a valid attachment block from PDF file path
     */
    createAttachmentFromFile(filePath) {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`);
            }

            const pdfBytes = fs.readFileSync(filePath);
            const base64Data = pdfBytes.toString('base64');

            const attachmentBlock = {
                type: "document",
                source: {
                    type: "base64",
                    media_type: "application/pdf",
                    data: base64Data
                }
            };

            return { success: true, attachmentBlock };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// CLI interface
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage: node pdf-validator.js <pdf-file-path> [page-limit]');
        process.exit(1);
    }

    const filePath = args[0];
    const pageLimit = args[1] ? parseInt(args[1]) : 100;

    const validator = new PDFValidator(pageLimit);

    console.log('Creating attachment block from PDF file...');
    const creation = validator.createAttachmentFromFile(filePath);

    if (!creation.success) {
        console.log(`FAILED: ${creation.error}`);
        process.exit(1);
    }

    console.log('Validating PDF attachment block...');
    const result = validator.validateAttachment(creation.attachmentBlock);

    if (result.valid) {
        console.log(`PASSED: PDF is valid (${result.size} bytes, ${result.pages} pages)`);
        console.log('Attachment block structure:');
        console.log(JSON.stringify({
            type: creation.attachmentBlock.type,
            source: {
                type: creation.attachmentBlock.source.type,
                media_type: creation.attachmentBlock.source.media_type,
                data: `[${creation.attachmentBlock.source.data.length} chars of base64 data]`
            }
        }, null, 2));
    } else {
        console.log(`FAILED: ${result.reason}`);
        process.exit(1);
    }
}

module.exports = PDFValidator;