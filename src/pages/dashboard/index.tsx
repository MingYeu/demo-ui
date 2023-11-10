import Layout from '@/components/layout';
import Toast from '@/lib/Toast';
import { toast } from 'react-toastify';
import { authentication } from '@/lib/authentication';
import { Button, Form, Table, TableColumnProps, TableProps } from 'antd';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { Case } from '@/types/case';
import { useState } from 'react';
import useLocalStorage from 'use-local-storage';
import { useQuery } from '@tanstack/react-query';
import queryString from 'query-string';
import AddCaseModal from '@/components/case/modals/AddCase';
import { PlusOutlined } from '@ant-design/icons';

const Index: NextPage<StaffPortalProps> = ({ staff }) => {
    const { t, i18n } = useTranslation(['dashboard']);
    const currentLocale = i18n.language;
    const router = useRouter();
    const defaultColumns = ['id', 'name', 'description'];
    const [column, setColumn] = useLocalStorage<string[]>('caseColumn', defaultColumns);
    const [addCaseModalOpen, setAddCaseModalOpen] = useState<boolean>(false);

    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 10,
        total: 0,
        sortField: 'createdAt',
        sortOrder: 'desc',
        fetch: true,
    });

    const caseQuery = useQuery({
        queryKey: ['case', 'pagination', pagination],
        enabled: pagination.fetch,
        keepPreviousData: true,
        queryFn: async () => {
            const query = queryString.stringify({
                page: pagination.current,
                row: pagination.pageSize,
                sortField: pagination.sortField,
                sortOrder: pagination.sortOrder,
            });
            const res = await fetch(`/api/staff/case?${query}`, {
                method: 'GET',
                headers: {
                    'accept-language': currentLocale,
                },
                credentials: 'include',
            });

            const response = (await res.json()) as PaginationResponse<Case[]>;

            if (!response.success) {
                throw new Error(t(response.message) as string);
            }

            setPagination((prevValue) => {
                return {
                    ...prevValue,
                    current: response.page,
                    total: response.total,
                    fetch: false,
                };
            });

            return response.data;
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const paginationOnChange: TableProps<Case>['onChange'] = (tablePagination, filter, sorter) => {
        const sorting: any = sorter;
        setPagination((prev) => {
            return {
                ...prev,
                current: tablePagination.current as number,
                pageSize: tablePagination.pageSize as number,
                sortField: sorting.field,
                sortOrder: sorting.order == 'ascend' ? 'asc' : !sorting.order ? prev.sortOrder : 'desc',
                fetch: true,
            };
        });
    };

    const columns = [
        {
            title: t('id'),
            dataIndex: 'id',
            render: (id: string, caseData: Case) => {
                return caseData.caseId;
            },
        },

        {
            title: t('name'),
            dataIndex: 'name',
        },
        {
            title: t('description'),
            dataIndex: 'description',
        },
    ] as TableColumnProps<Case>[];

    return (
        <Layout staff={staff} activeMenu={['dashboard']}>
            <div className="flex justify-between mb-4">
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddCaseModalOpen(true)}>
                    {t('createCase')}
                </Button>
            </div>
            <Table
                bordered
                className="mt-2"
                columns={columns}
                dataSource={caseQuery.data}
                loading={caseQuery.isFetching}
                rowKey={(record) => record.id}
                scroll={{ x: 1000 }}
                onChange={paginationOnChange}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    defaultPageSize: 1,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 25, 50, 100],
                    showTotal: (total, range) => t('common:pagination', { range0: range[0], range1: range[1], total: total }),
                    total: pagination.total,
                }}
                rowClassName="cursor-pointer"
            />
            <AddCaseModal open={addCaseModalOpen} setOpen={setAddCaseModalOpen} setPagination={setPagination} />
        </Layout>
    );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async ({ locale, req, resolvedUrl }) => {
    const authResponse = await authentication(req);

    if (!authResponse.success) {
        if (authResponse.unauthorized) {
            return {
                redirect: {
                    destination: `${locale === 'en-GB' ? '/' : `/${locale}`}/unauthorized`,
                    permanent: false,
                },
            };
        }
        return {
            redirect: {
                destination: `${locale === 'en-GB' ? '/' : `/${locale}`}?redirect=${resolvedUrl}`,
                permanent: false,
            },
        };
    }

    return {
        props: {
            staff: authResponse.data,
            ...(await serverSideTranslations(locale as string, ['dashboard', 'layout', 'common', 'messages'])),
        },
    };
};
