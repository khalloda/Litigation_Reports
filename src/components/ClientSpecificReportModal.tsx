import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  Card,
  Badge,
  Dropdown,
  InputGroup,
  ListGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FileText, Calendar, CheckSquare } from 'lucide-react';
import { apiService as api } from '../services/api';
import { exportToPDF } from '../utils/exportUtils';

interface Client {
  id: number;
  client_name_ar: string;
  client_name_en: string;
}

interface Column {
  key: string;
  label: string;
  label_en: string;
}

interface ReportType {
  key: string;
  label: string;
  label_en: string;
}

interface ClientSpecificReportOptions {
  clients: Client[];
  availableColumns: {
    cases: Column[];
    hearings: Column[];
  };
  reportTypes: ReportType[];
}

interface ClientSpecificReportModalProps {
  show: boolean;
  onHide: () => void;
}

const ClientSpecificReportModal: React.FC<ClientSpecificReportModalProps> = ({ show, onHide }) => {
  const { t } = useTranslation();

  // Form state
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [reportType, setReportType] = useState<'cases' | 'hearings'>('cases');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Client search state
  const [clientSearchTerm, setClientSearchTerm] = useState<string>('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState<string>('');

  // Component state
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ClientSpecificReportOptions | null>(null);

  // Load options when modal opens
  useEffect(() => {
    if (show) {
      loadOptions();
    }
  }, [show]);

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      resetForm();
    }
  }, [show]);

  // Update selected columns when report type changes
  useEffect(() => {
    if (options && reportType) {
      // Pre-select commonly used columns from actual available columns
      const availableColumns =
        reportType === 'cases' ? options.availableColumns.cases : options.availableColumns.hearings;

      // Select the first few most commonly used columns
      const defaultColumnKeys = availableColumns
        .slice(0, 4) // Take first 4 columns
        .map((col) => col.key);

      setSelectedColumns(defaultColumnKeys);
    }
  }, [reportType, options]);

  const loadOptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/reports/client-specific');

      if (response.success) {
        setOptions(response.data);
      } else {
        setError('Failed to load report options');
      }
    } catch (err) {
      console.error('Error loading client specific report options:', err);
      setError('خطأ في تحميل خيارات التقرير');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedClientId('');
    setReportType('cases');
    setSelectedColumns([]);
    setDateFrom('');
    setDateTo('');
    setClientSearchTerm('');
    setShowClientDropdown(false);
    setSelectedClientName('');
    setError(null);
  };

  // Filter clients based on search term
  const filteredClients = useMemo(() => {
    if (!options?.clients) return [];

    const searchLower = clientSearchTerm.toLowerCase().trim();
    if (!searchLower) {
      // Show first 20 clients when no search term
      return options.clients.slice(0, 20);
    }

    // Filter by both Arabic and English names
    const filtered = options.clients.filter((client) => {
      const nameAr = (client.client_name_ar || '').toLowerCase();
      const nameEn = (client.client_name_en || '').toLowerCase();
      const id = client.id.toString();

      return (
        nameAr.includes(searchLower) || nameEn.includes(searchLower) || id.includes(searchLower)
      );
    });

    // Limit results to 50 for performance
    return filtered.slice(0, 50);
  }, [options?.clients, clientSearchTerm]);

  // Handle client selection
  const handleClientSelect = (client: Client) => {
    setSelectedClientId(client.id.toString());
    setSelectedClientName(client.client_name_ar || client.client_name_en || `Client #${client.id}`);
    setShowClientDropdown(false);
    setClientSearchTerm('');
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClientSearchTerm(value);
    setShowClientDropdown(true);

    // Clear selection if search is cleared
    if (!value.trim()) {
      setSelectedClientId('');
      setSelectedClientName('');
    }
  };

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnKey) ? prev.filter((col) => col !== columnKey) : [...prev, columnKey]
    );
  };

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      setError(null);

      // Validation
      if (!selectedClientId) {
        setError('يرجى اختيار عميل');
        return;
      }

      if (selectedColumns.length === 0) {
        setError('يرجى اختيار حقل واحد على الأقل');
        return;
      }

      if (reportType === 'hearings' && (!dateFrom || !dateTo)) {
        setError('يرجى تحديد فترة زمنية للجلسات');
        return;
      }

      // Prepare request data
      const requestData = {
        client_id: selectedClientId,
        report_type: reportType,
        columns: selectedColumns,
        ...(reportType === 'hearings' && {
          date_from: dateFrom,
          date_to: dateTo,
        }),
      };

      // Generate report
      console.log('🔍 SENDING API REQUEST: /reports/client-specific with data:', requestData);
      const response = await api.post('/reports/client-specific', requestData);
      console.log('🔍 API RESPONSE received:', response);

      if (response.success) {
        console.log('🔍 RESPONSE SUCCESS - entering bulletproof filtering');
        // Get client name for report title
        const selectedClient = options?.clients.find((c) => c.id.toString() === selectedClientId);
        const clientName =
          selectedClient?.client_name_ar || selectedClient?.client_name_en || 'Unknown Client';

        // BULLETPROOF: Ensure perfect column-data matching
        const dataKeys = response.data.data.length > 0 ? Object.keys(response.data.data[0]) : [];
        console.log('🔍 BULLETPROOF START: Available data keys:', dataKeys);
        console.log('🔍 BULLETPROOF START: Selected columns from UI:', selectedColumns);

        // Create export columns with validation - NO DUPLICATION
        const exportColumns = selectedColumns
          .map((colKey) => {
            const allColumns =
              reportType === 'cases'
                ? options?.availableColumns.cases
                : options?.availableColumns.hearings;

            const column = allColumns?.find((col) => col.key === colKey);
            const cleanKey = colKey.split('.').pop() || colKey;

            console.log(`🔍 Processing column: "${colKey}" → clean: "${cleanKey}"`);

            // CRITICAL: Only return if data actually has this key
            if (!dataKeys.includes(cleanKey)) {
              console.log(`❌ BULLETPROOF SKIP: ${colKey} (clean: ${cleanKey}) - no matching data`);
              return null;
            }

            console.log(`✅ BULLETPROOF KEEP: ${colKey} (clean: ${cleanKey}) - has matching data`);
            return {
              key: cleanKey, // Always use clean key for PDF
              label: column?.label || colKey,
            };
          })
          .filter((col) => col !== null); // Remove null entries

        console.log('🎯 BULLETPROOF FINAL: Export columns ready for PDF:', exportColumns);
        console.log(
          '✅ BULLETPROOF SUCCESS: All',
          exportColumns.length,
          'columns have perfect data match'
        );

        // Export to PDF with professional branding
        await exportToPDF(response.data.data, {
          filename: `client_specific_report_${selectedClientId}_${reportType}_${Date.now()}`,
          columns: exportColumns,
          title: `تقرير ${reportType === 'cases' ? 'القضايا' : 'الجلسات'} - ${clientName}`,
        });

        // Success - close modal
        onHide();
      } else {
        console.log('🔍 RESPONSE FAILED - response.success is false:', response);
        setError(response.message || 'Failed to generate report');
      }
    } catch (err) {
      console.error('Error generating client specific report:', err);
      setError('خطأ في إنشاء التقرير');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <Modal show={show} onHide={onHide} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>تقرير عميل محدد</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center py-5'>
          <Spinner animation='border' />
          <p className='mt-2'>جاري تحميل الخيارات...</p>
        </Modal.Body>
      </Modal>
    );
  }

  const availableColumns =
    reportType === 'cases'
      ? options?.availableColumns.cases || []
      : options?.availableColumns.hearings || [];

  return (
    <Modal show={show} onHide={onHide} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>
          <FileText className='me-2' size={20} />
          تقرير عميل محدد
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant='danger' className='mb-3'>
            {error}
          </Alert>
        )}

        <Row>
          {/* Client Selection */}
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label className='fw-bold'>
                <Badge bg='primary' className='me-2'>
                  1
                </Badge>
                اختر العميل
              </Form.Label>

              <div className='position-relative'>
                <InputGroup>
                  <Form.Control
                    type='text'
                    placeholder={selectedClientName || 'ابحث عن عميل أو اكتب الاسم...'}
                    value={clientSearchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => setShowClientDropdown(true)}
                    disabled={generating}
                    style={{ textAlign: 'right' }}
                  />
                  <Button
                    variant='outline-secondary'
                    onClick={() => setShowClientDropdown(!showClientDropdown)}
                    disabled={generating}
                  >
                    ▼
                  </Button>
                </InputGroup>

                {/* Selected Client Display */}
                {selectedClientName && !showClientDropdown && (
                  <div className='mt-1'>
                    <Badge bg='success' className='me-2'>
                      ✓
                    </Badge>
                    <small className='text-success'>{selectedClientName}</small>
                    <Button
                      variant='link'
                      size='sm'
                      className='p-0 ms-2 text-danger'
                      onClick={() => {
                        setSelectedClientId('');
                        setSelectedClientName('');
                        setClientSearchTerm('');
                      }}
                      disabled={generating}
                    >
                      ✕
                    </Button>
                  </div>
                )}

                {/* Dropdown Menu */}
                {showClientDropdown && (
                  <div
                    className='position-absolute w-100 bg-white border rounded shadow-lg'
                    style={{
                      zIndex: 1050,
                      maxHeight: '300px',
                      overflowY: 'auto',
                      top: '100%',
                    }}
                  >
                    {filteredClients.length > 0 ? (
                      <ListGroup variant='flush'>
                        {clientSearchTerm.trim() === '' && (
                          <ListGroup.Item className='text-muted text-center py-2'>
                            <small>عرض أول 20 عميل - ابحث للعثور على المزيد</small>
                          </ListGroup.Item>
                        )}
                        {filteredClients.map((client) => (
                          <ListGroup.Item
                            key={client.id}
                            action
                            onClick={() => handleClientSelect(client)}
                            className='d-flex justify-content-between align-items-center'
                            style={{ cursor: 'pointer', textAlign: 'right' }}
                          >
                            <span>
                              <strong>{client.client_name_ar || client.client_name_en}</strong>
                              {client.client_name_ar && client.client_name_en && (
                                <>
                                  <br />
                                  <small className='text-muted'>{client.client_name_en}</small>
                                </>
                              )}
                            </span>
                            <Badge bg='secondary'>#{client.id}</Badge>
                          </ListGroup.Item>
                        ))}
                        {filteredClients.length === 50 && (
                          <ListGroup.Item className='text-muted text-center py-2'>
                            <small>عرض أول 50 نتيجة - كن أكثر تحديداً في البحث</small>
                          </ListGroup.Item>
                        )}
                      </ListGroup>
                    ) : (
                      <div className='p-3 text-center text-muted'>
                        🔍 لا توجد نتائج للبحث "{clientSearchTerm}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Click outside to close dropdown */}
              {showClientDropdown && (
                <div
                  className='position-fixed'
                  style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1040,
                  }}
                  onClick={() => setShowClientDropdown(false)}
                />
              )}
            </Form.Group>
          </Col>

          {/* Report Type Selection */}
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label className='fw-bold'>
                <Badge bg='success' className='me-2'>
                  2
                </Badge>
                نوع التقرير
              </Form.Label>
              <Form.Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as 'cases' | 'hearings')}
                disabled={generating}
              >
                {options?.reportTypes.map((type) => (
                  <option key={type.key} value={type.key}>
                    {type.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Date Range for Hearings */}
        {reportType === 'hearings' && (
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label className='fw-bold'>
                  <Calendar className='me-2' size={16} />
                  من تاريخ
                </Form.Label>
                <Form.Control
                  type='date'
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  disabled={generating}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label className='fw-bold'>
                  <Calendar className='me-2' size={16} />
                  إلى تاريخ
                </Form.Label>
                <Form.Control
                  type='date'
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  disabled={generating}
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        {/* Column Selection */}
        <Form.Group className='mb-3'>
          <Form.Label className='fw-bold'>
            <Badge bg='warning' className='me-2'>
              3
            </Badge>
            <CheckSquare className='me-2' size={16} />
            اختر الحقول المطلوبة
          </Form.Label>
          <Card className='mt-2'>
            <Card.Body>
              <Row>
                {availableColumns.map((column) => (
                  <Col md={6} key={column.key} className='mb-2'>
                    <Form.Check
                      type='checkbox'
                      id={`column-${column.key}`}
                      label={column.label}
                      checked={selectedColumns.includes(column.key)}
                      onChange={() => handleColumnToggle(column.key)}
                      disabled={generating}
                    />
                  </Col>
                ))}
              </Row>
              {selectedColumns.length > 0 && (
                <div className='mt-3 pt-3 border-top'>
                  <small className='text-muted'>تم اختيار {selectedColumns.length} حقل</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={onHide} disabled={generating}>
          إلغاء
        </Button>
        <Button
          variant='primary'
          onClick={handleGenerateReport}
          disabled={generating || !selectedClientId || selectedColumns.length === 0}
        >
          {generating ? (
            <>
              <Spinner as='span' animation='border' size='sm' role='status' className='me-2' />
              جاري الإنشاء...
            </>
          ) : (
            <>
              <FileText className='me-2' size={16} />
              إنشاء التقرير
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClientSpecificReportModal;
