import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  Badge,
  Dropdown,
  Modal,
  Alert,
  Spinner,
  InputGroup,
  Pagination
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useRTL } from '@hooks/useRTL';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Upload,
  File,
  Calendar,
  User,
  Tag,
  FileCheck,
  Archive,
  ExternalLink
} from 'lucide-react';
import { apiService as api } from '../services/api';

interface Document {
  id: number;
  title: string;
  description?: string;
  document_type: string;
  entity_type?: string;
  entity_id?: number;
  entity_name?: string;
  entity_name_ar?: string;
  original_filename: string;
  stored_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: number;
  uploader_name: string;
  is_public: boolean;
  tags?: string;
  created_at: string;
  updated_at: string;
}

interface DocumentFilters {
  search: string;
  document_type: string;
  entity_type: string;
  entity_id: string;
  uploaded_by: string;
  date_from: string;
  date_to: string;
}

interface DocumentStats {
  total_documents: number;
  contracts: number;
  evidence: number;
  correspondence: number;
  legal_memos: number;
  court_filings: number;
  other: number;
  total_size_mb: number;
  public_documents: number;
  private_documents: number;
}

export function Documents() {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);

  // Filters
  const [filters, setFilters] = useState<DocumentFilters>({
    search: '',
    document_type: '',
    entity_type: '',
    entity_id: '',
    uploaded_by: '',
    date_from: '',
    date_to: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Upload form
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    document_type: 'other',
    entity_type: '',
    entity_id: '',
    is_public: false,
    tags: '',
    file: null as File | null
  });

  // Options
  const [documentTypes, setDocumentTypes] = useState<any>({});
  const [entityTypes, setEntityTypes] = useState<any>({});

  useEffect(() => {
    loadDocuments();
    loadStats();
    loadOptions();
  }, [currentPage, filters]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });

      const response = await api.get(`/documents?${params}`);

      if (response.success) {
        setDocuments(response.data.data);
        setCurrentPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.total_pages);
        setTotalDocuments(response.data.pagination.total);
      } else {
        setError('فشل في تحميل المستندات');
      }
    } catch (err) {
      console.error('Documents load error:', err);
      setError('خطأ في تحميل المستندات');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/documents/stats');
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Stats load error:', err);
    }
  };

  const loadOptions = async () => {
    try {
      const response = await api.get('/documents/options');
      if (response.success) {
        setDocumentTypes(response.data.document_types);
        setEntityTypes(response.data.entity_types);
      }
    } catch (err) {
      console.error('Options load error:', err);
    }
  };

  const handleFilterChange = (field: keyof DocumentFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleUploadDocument = async () => {
    try {
      if (!uploadData.file || !uploadData.title) {
        alert('يرجى إدخال العنوان واختيار ملف');
        return;
      }

      const formData = new FormData();
      formData.append('file', uploadData.file);
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('document_type', uploadData.document_type);
      formData.append('entity_type', uploadData.entity_type);
      formData.append('entity_id', uploadData.entity_id);
      formData.append('is_public', uploadData.is_public.toString());
      formData.append('tags', uploadData.tags);

      const response = await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.success) {
        setShowUploadModal(false);
        setUploadData({
          title: '',
          description: '',
          document_type: 'other',
          entity_type: '',
          entity_id: '',
          is_public: false,
          tags: '',
          file: null
        });
        loadDocuments();
        loadStats();
      } else {
        alert(response.message || 'فشل في رفع المستند');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('خطأ في رفع المستند');
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      window.open(`/api/documents/${document.id}/download`, '_blank');
    } catch (err) {
      console.error('Download error:', err);
      alert('خطأ في تحميل المستند');
    }
  };

  const handleDelete = async () => {
    if (!selectedDocument) return;

    try {
      const response = await api.delete(`/documents/${selectedDocument.id}`);

      if (response.success) {
        setShowDeleteModal(false);
        setSelectedDocument(null);
        loadDocuments();
        loadStats();
      } else {
        alert(response.message || 'فشل في حذف المستند');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('خطأ في حذف المستند');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'contract': return <FileCheck className="text-primary" size={16} />;
      case 'evidence': return <Archive className="text-warning" size={16} />;
      case 'correspondence': return <FileText className="text-info" size={16} />;
      case 'legal_memo': return <File className="text-success" size={16} />;
      case 'court_filing': return <ExternalLink className="text-danger" size={16} />;
      default: return <FileText className="text-muted" size={16} />;
    }
  };

  return (
    <Container fluid className="py-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <FileText className="me-2" />
                إدارة المستندات
              </h2>
              <p className="text-muted mb-0">Documents Management</p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowUploadModal(true)}
            >
              <Plus size={16} className="me-1" />
              رفع مستند جديد
            </Button>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      {stats && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="bg-primary text-white">
              <Card.Body className="text-center">
                <h3>{stats.total_documents}</h3>
                <p className="mb-0">إجمالي المستندات</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="bg-success text-white">
              <Card.Body className="text-center">
                <h3>{stats.contracts}</h3>
                <p className="mb-0">العقود</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="bg-warning text-white">
              <Card.Body className="text-center">
                <h3>{stats.evidence}</h3>
                <p className="mb-0">الأدلة</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="bg-info text-white">
              <Card.Body className="text-center">
                <h3>{stats.total_size_mb} MB</h3>
                <p className="mb-0">إجمالي الحجم</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">البحث والتصفية</h5>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} className="me-1" />
              تصفية متقدمة
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="البحث في العنوان أو الوصف..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
                <Button variant="outline-secondary">
                  <Search size={16} />
                </Button>
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filters.document_type}
                onChange={(e) => handleFilterChange('document_type', e.target.value)}
              >
                <option value="">جميع الأنواع</option>
                {Object.entries(documentTypes).map(([key, value]) => (
                  <option key={key} value={key}>{value as string}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filters.entity_type}
                onChange={(e) => handleFilterChange('entity_type', e.target.value)}
              >
                <option value="">جميع الكيانات</option>
                {Object.entries(entityTypes).map(([key, value]) => (
                  <option key={key} value={key}>{value as string}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          {showFilters && (
            <Row className="mt-3">
              <Col md={3}>
                <Form.Label>من تاريخ</Form.Label>
                <Form.Control
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => handleFilterChange('date_from', e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label>إلى تاريخ</Form.Label>
                <Form.Control
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => handleFilterChange('date_to', e.target.value)}
                />
              </Col>
              <Col md={6}>
                <Form.Label>الكيان المرتبط</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="معرف الكيان"
                  value={filters.entity_id}
                  onChange={(e) => handleFilterChange('entity_id', e.target.value)}
                />
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Documents Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">قائمة المستندات ({totalDocuments})</h5>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">جاري تحميل المستندات...</p>
            </div>
          ) : (
            <>
              <Table responsive>
                <thead>
                  <tr>
                    <th>النوع</th>
                    <th>العنوان</th>
                    <th>اسم الملف</th>
                    <th>الحجم</th>
                    <th>المرفوع بواسطة</th>
                    <th>الكيان المرتبط</th>
                    <th>تاريخ الرفع</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((document) => (
                    <tr key={document.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {getDocumentTypeIcon(document.document_type)}
                          <span className="ms-2">
                            {documentTypes[document.document_type] || document.document_type}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{document.title}</strong>
                          {document.description && (
                            <small className="d-block text-muted">
                              {document.description}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        <code>{document.original_filename}</code>
                      </td>
                      <td>{formatFileSize(document.file_size)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <User size={14} className="me-1" />
                          {document.uploader_name}
                        </div>
                      </td>
                      <td>
                        {document.entity_type && (
                          <Badge bg="secondary">
                            {entityTypes[document.entity_type]} #{document.entity_id}
                          </Badge>
                        )}
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={14} className="me-1" />
                          {new Date(document.created_at).toLocaleDateString('ar-SA')}
                        </div>
                      </td>
                      <td>
                        <Badge bg={document.is_public ? 'success' : 'warning'}>
                          {document.is_public ? 'عام' : 'خاص'}
                        </Badge>
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm">
                            الإجراءات
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleDownload(document)}>
                              <Download size={14} className="me-1" />
                              تحميل
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                setSelectedDocument(document);
                                setShowEditModal(true);
                              }}
                            >
                              <Edit size={14} className="me-1" />
                              تعديل
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              className="text-danger"
                              onClick={() => {
                                setSelectedDocument(document);
                                setShowDeleteModal(true);
                              }}
                            >
                              <Trash2 size={14} className="me-1" />
                              حذف
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.Prev
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    />
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Pagination.Item
                          key={page}
                          active={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Pagination.Item>
                      );
                    })}
                    <Pagination.Next
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Upload Modal */}
      <Modal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        size="lg"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Upload size={20} className="me-2" />
            رفع مستند جديد
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>العنوان *</Form.Label>
                  <Form.Control
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>نوع المستند *</Form.Label>
                  <Form.Select
                    value={uploadData.document_type}
                    onChange={(e) => setUploadData(prev => ({ ...prev, document_type: e.target.value }))}
                  >
                    {Object.entries(documentTypes).map(([key, value]) => (
                      <option key={key} value={key}>{value as string}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>الوصف</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={uploadData.description}
                onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>نوع الكيان المرتبط</Form.Label>
                  <Form.Select
                    value={uploadData.entity_type}
                    onChange={(e) => setUploadData(prev => ({ ...prev, entity_type: e.target.value }))}
                  >
                    <option value="">غير مرتبط</option>
                    {Object.entries(entityTypes).map(([key, value]) => (
                      <option key={key} value={key}>{value as string}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>معرف الكيان</Form.Label>
                  <Form.Control
                    type="number"
                    value={uploadData.entity_id}
                    onChange={(e) => setUploadData(prev => ({ ...prev, entity_id: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>الكلمات المفتاحية</Form.Label>
              <Form.Control
                type="text"
                value={uploadData.tags}
                onChange={(e) => setUploadData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="افصل بين الكلمات بفاصلة"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="is-public"
                label="مستند عام (يمكن لجميع المستخدمين رؤيته)"
                checked={uploadData.is_public}
                onChange={(e) => setUploadData(prev => ({ ...prev, is_public: e.target.checked }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>اختيار الملف *</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  setUploadData(prev => ({ ...prev, file: file || null }));
                }}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              />
              <Form.Text className="text-muted">
                الأنواع المدعومة: PDF, DOC, DOCX, TXT, JPG, PNG, GIF (الحد الأقصى: 10MB)
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowUploadModal(false)}>
            إلغاء
          </Button>
          <Button variant="primary" onClick={handleUploadDocument}>
            <Upload size={16} className="me-1" />
            رفع المستند
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Modal.Header closeButton>
          <Modal.Title>تأكيد الحذف</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          هل أنت متأكد من حذف المستند "{selectedDocument?.title}"؟
          <br />
          <strong>تحذير:</strong> لا يمكن التراجع عن هذا الإجراء.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            إلغاء
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 size={16} className="me-1" />
            حذف المستند
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}