import Toast from '@/lib/Toast';
import { Case } from '@/types/case';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert, Button, Form, Input, Modal, Select } from 'antd';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';

interface AddCaseModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    setPagination: Dispatch<SetStateAction<PaginationProps>>;
}

const AddCaseModal: React.FC<AddCaseModalProps> = ({ open, setOpen, setPagination }) => {
    const { t, i18n } = useTranslation(['case', 'common']);
    const currentLocale = i18n.language;
    const [addCaseForm] = Form.useForm();
    const createCaseToast = new Toast('createCase');
    const router = useRouter();

    const createCaseMutation = useMutation({
        mutationFn: async (values: { name: string; description: string; process: string; workId: string; clientId: string }) => {
            createCaseToast.loading(t('messages:loading.creatingCase'));
            const res = await fetch('/api/staff/case', {
                method: 'POST',
                headers: {
                    'accept-language': currentLocale,
                    'content-type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(values),
            });

            const response = (await res.json()) as APIResponse<Case>;

            if (!response.success) {
                throw new Error(t(response.message) as string);
            }

            return response.data;
        },
        onError: (error: Error) => {
            createCaseToast.update('error', error.message);
        },
        onSuccess: (data) => {
            createCaseToast.update('success', t('messages:success.caseCreated'));
            setOpen(false);
            setPagination((prev) => {
                return {
                    ...prev,
                    fetch: true,
                };
            });
        },
    });

    const onCreateHandler = () => {
        addCaseForm.validateFields().then((values) => {
            createCaseMutation.mutate(values);
        });
    };

    const onCloseHandler = () => {
        addCaseForm.resetFields();
        setOpen(false);
    };

    return (
        <Modal title={t('addCase')} open={open} onCancel={onCloseHandler} footer={null}>
            <Form form={addCaseForm} layout="vertical" name="Add Case Form">
                <Form.Item name="name" label={t('name')} rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label={t('description')} rules={[{ required: true }, { max: 100 }]}>
                    <Input.TextArea rows={3} maxLength={100} showCount />
                </Form.Item>
                <div className="flex justify-end">
                    <Button type="primary" onClick={onCreateHandler} loading={false}>
                        {t('addCase')}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddCaseModal;
