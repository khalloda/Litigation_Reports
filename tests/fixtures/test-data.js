/**
 * Test data fixtures for Playwright tests
 * This file contains sample data for testing various scenarios
 */

const testData = {
  // User credentials for testing
  users: {
    admin: {
      email: 'admin@test.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin'
    },
    lawyer: {
      email: 'lawyer@test.com',
      password: 'lawyer123',
      name: 'Lawyer User',
      role: 'lawyer'
    },
    staff: {
      email: 'staff@test.com',
      password: 'staff123',
      name: 'Staff User',
      role: 'staff'
    }
  },

  // Arabic user data
  arabicUsers: {
    admin: {
      email: 'admin@test.com',
      password: 'admin123',
      name: 'المدير العام',
      role: 'admin'
    },
    lawyer: {
      email: 'lawyer@test.com',
      password: 'lawyer123',
      name: 'المحامي ناجي',
      role: 'lawyer'
    },
    staff: {
      email: 'staff@test.com',
      password: 'staff123',
      name: 'موظف المكتب',
      role: 'staff'
    }
  },

  // Client data for testing
  clients: {
    valid: {
      name: 'John Smith',
      arabicName: 'ناجي رمضان',
      email: 'john.smith@example.com',
      phone: '+1234567890',
      arabicPhone: '+966501234567',
      address: '123 Main Street, New York, NY 10001',
      arabicAddress: 'شارع الملك فهد، الرياض، المملكة العربية السعودية',
      nationality: 'American',
      arabicNationality: 'أمريكي',
      idNumber: '123456789',
      arabicIdNumber: '1234567890',
      birthDate: '1990-01-01',
      notes: 'Important client with multiple cases',
      arabicNotes: 'عميل مهم لديه عدة قضايا'
    },
    invalid: {
      name: '',
      email: 'invalid-email',
      phone: '123',
      address: '',
      nationality: '',
      idNumber: '',
      birthDate: 'invalid-date'
    },
    mixedContent: {
      name: 'ناجي Smith',
      email: 'naji.smith@example.com',
      phone: '+966501234567',
      address: 'شارع الملك فهد، الرياض / King Fahd Street, Riyadh',
      nationality: 'سعودي / Saudi',
      notes: 'Mixed content client / عميل محتوى مختلط'
    }
  },

  // Case data for testing
  cases: {
    valid: {
      caseNumber: 'CASE-2024-001',
      arabicCaseNumber: 'قضية-2024-001',
      title: 'Contract Dispute',
      arabicTitle: 'نزاع تعاقدي',
      description: 'Contract dispute between parties',
      arabicDescription: 'نزاع تعاقدي بين الأطراف',
      caseType: 'Civil',
      arabicCaseType: 'مدني',
      status: 'Active',
      arabicStatus: 'نشط',
      priority: 'High',
      arabicPriority: 'عالي',
      startDate: '2024-01-01',
      expectedEndDate: '2024-12-31',
      court: 'Supreme Court',
      arabicCourt: 'المحكمة العليا',
      judge: 'Judge Johnson',
      arabicJudge: 'القاضي أحمد',
      opposingParty: 'ABC Company',
      arabicOpposingParty: 'شركة أ ب ج',
      opposingLawyer: 'Jane Doe',
      arabicOpposingLawyer: 'فاطمة محمد',
      notes: 'Important case requiring attention',
      arabicNotes: 'قضية مهمة تتطلب الاهتمام'
    },
    invalid: {
      caseNumber: '',
      title: '',
      description: '',
      caseType: '',
      status: '',
      startDate: 'invalid-date',
      expectedEndDate: 'invalid-date'
    }
  },

  // Hearing data for testing
  hearings: {
    valid: {
      hearingDate: '2024-12-15',
      hearingTime: '10:00',
      hearingType: 'Trial',
      arabicHearingType: 'محاكمة',
      location: 'Court Room 1',
      arabicLocation: 'قاعة المحكمة 1',
      description: 'Initial trial hearing',
      arabicDescription: 'جلسة محاكمة أولى',
      status: 'Scheduled',
      arabicStatus: 'مجدولة',
      notes: 'Important hearing',
      arabicNotes: 'جلسة مهمة'
    },
    invalid: {
      hearingDate: '',
      hearingTime: '',
      hearingType: '',
      location: '',
      description: '',
      status: ''
    }
  },

  // Invoice data for testing
  invoices: {
    valid: {
      invoiceNumber: 'INV-2024-001',
      arabicInvoiceNumber: 'فاتورة-2024-001',
      clientName: 'John Smith',
      arabicClientName: 'ناجي رمضان',
      amount: '5000.00',
      currency: 'USD',
      arabicCurrency: 'دولار',
      description: 'Legal services rendered',
      arabicDescription: 'خدمات قانونية مقدمة',
      issueDate: '2024-01-01',
      dueDate: '2024-02-01',
      status: 'Pending',
      arabicStatus: 'معلق',
      notes: 'Payment due within 30 days',
      arabicNotes: 'الدفع مستحق خلال 30 يوماً'
    },
    invalid: {
      invoiceNumber: '',
      clientName: '',
      amount: '',
      currency: '',
      description: '',
      issueDate: '',
      dueDate: ''
    }
  },

  // Document data for testing
  documents: {
    valid: {
      title: 'Contract Agreement',
      arabicTitle: 'اتفاقية تعاقد',
      description: 'Signed contract between parties',
      arabicDescription: 'عقد موثق بين الأطراف',
      documentType: 'Contract',
      arabicDocumentType: 'عقد',
      uploadDate: '2024-01-01',
      version: '1.0',
      status: 'Active',
      arabicStatus: 'نشط',
      notes: 'Important legal document',
      arabicNotes: 'وثيقة قانونية مهمة'
    },
    invalid: {
      title: '',
      description: '',
      documentType: '',
      uploadDate: '',
      version: '',
      status: ''
    }
  },

  // Search terms for testing
  searchTerms: {
    english: [
      'John Smith',
      'Contract',
      'Case',
      'Invoice',
      'Hearing',
      'Document',
      'Lawyer',
      'Client'
    ],
    arabic: [
      'ناجي رمضان',
      'عقد',
      'قضية',
      'فاتورة',
      'جلسة',
      'وثيقة',
      'محامي',
      'عميل'
    ],
    mixed: [
      'John ناجي',
      'Contract عقد',
      'Case قضية',
      'Invoice فاتورة'
    ],
    specialCharacters: [
      'Test@#$%',
      'Test123!@#',
      'Test-Name_123',
      'Test.Name+123'
    ]
  },

  // File upload test data
  fileUploads: {
    valid: {
      pdf: {
        name: 'test-document.pdf',
        type: 'application/pdf',
        size: 1024 * 1024 // 1MB
      },
      image: {
        name: 'test-image.jpg',
        type: 'image/jpeg',
        size: 512 * 1024 // 512KB
      },
      document: {
        name: 'test-document.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 2 * 1024 * 1024 // 2MB
      }
    },
    invalid: {
      tooLarge: {
        name: 'large-file.pdf',
        type: 'application/pdf',
        size: 10 * 1024 * 1024 // 10MB
      },
      wrongType: {
        name: 'test-file.exe',
        type: 'application/x-msdownload',
        size: 1024 * 1024 // 1MB
      },
      corrupted: {
        name: 'corrupted-file.pdf',
        type: 'application/pdf',
        size: 0
      }
    }
  },

  // Date formats for testing
  dateFormats: {
    english: {
      short: '12/31/2024',
      long: 'December 31, 2024',
      iso: '2024-12-31',
      time: '2024-12-31 10:30:00'
    },
    arabic: {
      short: '31/12/2024',
      long: '31 ديسمبر 2024',
      iso: '2024-12-31',
      time: '2024-12-31 10:30:00'
    }
  },

  // Currency formats for testing
  currencyFormats: {
    usd: {
      symbol: '$',
      code: 'USD',
      format: '1,234.56',
      arabicFormat: '1,234.56 دولار'
    },
    sar: {
      symbol: 'ر.س',
      code: 'SAR',
      format: '1,234.56',
      arabicFormat: '1,234.56 ريال'
    }
  },

  // Error messages for testing
  errorMessages: {
    english: {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone number',
      date: 'Please enter a valid date',
      number: 'Please enter a valid number',
      file: 'Please select a valid file',
      password: 'Password must be at least 8 characters',
      confirmPassword: 'Passwords do not match'
    },
    arabic: {
      required: 'هذا الحقل مطلوب',
      email: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
      phone: 'يرجى إدخال رقم هاتف صحيح',
      date: 'يرجى إدخال تاريخ صحيح',
      number: 'يرجى إدخال رقم صحيح',
      file: 'يرجى اختيار ملف صحيح',
      password: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
      confirmPassword: 'كلمات المرور غير متطابقة'
    }
  },

  // Performance test data
  performance: {
    largeDataset: {
      clients: 1000,
      cases: 5000,
      hearings: 10000,
      invoices: 2000,
      documents: 5000
    },
    loadTest: {
      concurrentUsers: 50,
      duration: 300, // 5 minutes
      rampUp: 60 // 1 minute
    }
  },

  // Accessibility test data
  accessibility: {
    colorContrast: {
      high: '#000000', // Black
      low: '#CCCCCC'   // Light gray
    },
    fontSize: {
      minimum: '14px',
      recommended: '16px',
      large: '18px'
    },
    focusIndicator: {
      visible: '2px solid #007bff',
      hidden: 'none'
    }
  }
};

// Helper functions for test data
const testDataHelpers = {
  // Generate random test data
  generateRandomClient: () => {
    const randomId = Math.floor(Math.random() * 10000);
    return {
      ...testData.clients.valid,
      name: `Client ${randomId}`,
      email: `client${randomId}@example.com`,
      phone: `+1234567${randomId.toString().padStart(3, '0')}`
    };
  },

  // Generate random case data
  generateRandomCase: () => {
    const randomId = Math.floor(Math.random() * 10000);
    return {
      ...testData.cases.valid,
      caseNumber: `CASE-2024-${randomId.toString().padStart(3, '0')}`,
      title: `Case ${randomId}`
    };
  },

  // Generate random invoice data
  generateRandomInvoice: () => {
    const randomId = Math.floor(Math.random() * 10000);
    return {
      ...testData.invoices.valid,
      invoiceNumber: `INV-2024-${randomId.toString().padStart(3, '0')}`,
      amount: (Math.random() * 10000).toFixed(2)
    };
  },

  // Get mixed content data
  getMixedContentData: (field) => {
    const mixedData = {
      name: 'ناجي Smith',
      email: 'naji.smith@example.com',
      address: 'شارع الملك فهد / King Fahd Street',
      notes: 'Mixed content / محتوى مختلط'
    };
    return mixedData[field] || '';
  },

  // Get Arabic data
  getArabicData: (field) => {
    const arabicData = {
      name: 'ناجي رمضان',
      email: 'naji@example.com',
      address: 'شارع الملك فهد، الرياض',
      notes: 'محتوى باللغة العربية'
    };
    return arabicData[field] || '';
  },

  // Get English data
  getEnglishData: (field) => {
    const englishData = {
      name: 'John Smith',
      email: 'john@example.com',
      address: '123 Main Street, New York',
      notes: 'English content'
    };
    return englishData[field] || '';
  }
};

module.exports = {
  testData,
  testDataHelpers
};
