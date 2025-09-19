<?php
/**
 * Invoice Controller
 *
 * Handles invoice management operations.
 */

class InvoiceController {

    public function index(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            // Get query parameters
            $page = (int) $request->get('page', 1);
            $limit = (int) $request->get('limit', DEFAULT_PAGE_SIZE);
            $filters = [
                'search' => $request->get('search'),
                'invoice_status' => $request->get('invoice_status'),
                'invoice_type' => $request->get('invoice_type'),
                'currency' => $request->get('currency'),
                'date_from' => $request->get('date_from'),
                'date_to' => $request->get('date_to')
            ];

            // Remove empty filters
            $filters = array_filter($filters, function($value) {
                return $value !== null && $value !== '';
            });

            $result = Invoice::getAll($page, $limit, $filters);

            return Response::success($result);

        } catch (Exception $e) {
            error_log("Invoices index error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve invoices');
        }
    }

    public function show(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $id = $request->getRouteParam('id');
            if (!$id) {
                return Response::error('Invoice ID is required', 400);
            }

            $invoice = Invoice::findById($id);
            if (!$invoice) {
                return Response::notFound('Invoice not found');
            }

            return Response::success($invoice);

        } catch (Exception $e) {
            error_log("Invoice show error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve invoice');
        }
    }

    public function store(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            // Validate input
            $validator = new Validator($request->all(), [
                'invoice_date' => 'required|date',
                'amount' => 'required|numeric|min:0',
                'currency' => 'in:EGP,USD,EUR',
                'invoice_status' => 'in:draft,sent,paid,overdue,cancelled',
                'invoice_type' => 'in:service,expenses,advance',
                'invoice_number' => 'max:50',
                'contract_id' => 'max:50',
                'usd_amount' => 'numeric|min:0',
                'has_vat' => 'boolean',
                'report_generated' => 'boolean',
                'payment_date' => 'date'
            ]);

            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }

            $data = $request->only([
                'invoice_number', 'contract_id', 'invoice_date', 'amount', 'currency', 'usd_amount',
                'invoice_details', 'invoice_status', 'invoice_type', 'has_vat', 'payment_date', 'report_generated'
            ]);

            $invoiceId = Invoice::create($data);

            // Get the created invoice
            $invoice = Invoice::findById($invoiceId);

            return Response::success($invoice, 'Invoice created successfully', 201);

        } catch (Exception $e) {
            error_log("Invoice store error: " . $e->getMessage());
            return Response::serverError('Failed to create invoice');
        }
    }

    public function update(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $id = $request->getRouteParam('id');
            if (!$id) {
                return Response::error('Invoice ID is required', 400);
            }

            // Check if invoice exists
            $existingInvoice = Invoice::findById($id);
            if (!$existingInvoice) {
                return Response::notFound('Invoice not found');
            }

            // Validate input - for updates, only validate provided fields
            $validationRules = [];
            $requestData = $request->all();

            // Only add validation rules for fields that are actually provided
            if (isset($requestData['invoice_date'])) {
                $validationRules['invoice_date'] = 'date';
            }
            if (isset($requestData['amount'])) {
                $validationRules['amount'] = 'numeric|min:0';
            }
            if (isset($requestData['currency'])) {
                $validationRules['currency'] = 'in:EGP,USD,EUR';
            }
            if (isset($requestData['invoice_status'])) {
                $validationRules['invoice_status'] = 'in:draft,sent,paid,overdue,cancelled';
            }
            if (isset($requestData['invoice_type'])) {
                $validationRules['invoice_type'] = 'in:service,expenses,advance';
            }
            if (isset($requestData['invoice_number'])) {
                $validationRules['invoice_number'] = 'max:50';
            }
            if (isset($requestData['contract_id'])) {
                $validationRules['contract_id'] = 'max:50';
            }
            if (isset($requestData['usd_amount'])) {
                $validationRules['usd_amount'] = 'numeric|min:0';
            }
            if (isset($requestData['has_vat'])) {
                $validationRules['has_vat'] = 'boolean';
            }
            if (isset($requestData['report_generated'])) {
                $validationRules['report_generated'] = 'boolean';
            }
            if (isset($requestData['payment_date'])) {
                $validationRules['payment_date'] = 'date';
            }

            $validator = new Validator($requestData, $validationRules);

            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }

            $data = $request->only([
                'invoice_number', 'contract_id', 'invoice_date', 'amount', 'currency', 'usd_amount',
                'invoice_details', 'invoice_status', 'invoice_type', 'has_vat', 'payment_date', 'report_generated'
            ]);

            // Remove empty values
            $data = array_filter($data, function($value) {
                return $value !== null && $value !== '';
            });

            if (empty($data)) {
                return Response::error('No data provided for update', 400);
            }

            Invoice::update($id, $data);

            // Get the updated invoice
            $invoice = Invoice::findById($id);

            return Response::success($invoice, 'Invoice updated successfully');

        } catch (Exception $e) {
            error_log("Invoice update error: " . $e->getMessage());
            return Response::serverError('Failed to update invoice');
        }
    }

    public function destroy(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $id = $request->getRouteParam('id');
            if (!$id) {
                return Response::error('Invoice ID is required', 400);
            }

            // Check if invoice exists
            $invoice = Invoice::findById($id);
            if (!$invoice) {
                return Response::notFound('Invoice not found');
            }

            Invoice::delete($id);

            return Response::success(null, 'Invoice deleted successfully');

        } catch (Exception $e) {
            error_log("Invoice destroy error: " . $e->getMessage());
            return Response::serverError('Failed to delete invoice');
        }
    }

    public function stats(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $stats = Invoice::getStats();

            return Response::success($stats);

        } catch (Exception $e) {
            error_log("Invoice stats error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve invoice statistics');
        }
    }

    public function search(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $searchTerm = $request->get('q');
            if (!$searchTerm) {
                return Response::error('Search term is required', 400);
            }

            $page = (int) $request->get('page', 1);
            $limit = (int) $request->get('limit', DEFAULT_PAGE_SIZE);

            $result = Invoice::search($searchTerm, $page, $limit);

            return Response::success($result);

        } catch (Exception $e) {
            error_log("Invoice search error: " . $e->getMessage());
            return Response::serverError('Failed to search invoices');
        }
    }

    public function byStatus(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $status = $request->get('status');
            if (!$status) {
                return Response::error('Status is required', 400);
            }

            $page = (int) $request->get('page', 1);
            $limit = (int) $request->get('limit', DEFAULT_PAGE_SIZE);

            $result = Invoice::getByStatus($status, $page, $limit);

            return Response::success($result);

        } catch (Exception $e) {
            error_log("Invoice by status error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve invoices by status');
        }
    }

    public function overdue(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $page = (int) $request->get('page', 1);
            $limit = (int) $request->get('limit', DEFAULT_PAGE_SIZE);

            $result = Invoice::getOverdue($page, $limit);

            return Response::success($result);

        } catch (Exception $e) {
            error_log("Overdue invoices error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve overdue invoices');
        }
    }

    public function options(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $options = [
                'status' => Invoice::getStatusOptions(),
                'type' => Invoice::getTypeOptions(),
                'currency' => Invoice::getCurrencyOptions()
            ];

            return Response::success($options);

        } catch (Exception $e) {
            error_log("Invoice options error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve invoice options');
        }
    }
}