type Locale = 'en-GB' | 'zh-HK';

interface BreadCrumbItem {
    label: string;
    path: string;
}

interface StaffPortalProps {
    staff: Staff;
}

interface PaginationProps {
    current: number;
    pageSize: number;
    total: number;
    sortField: string | null;
    sortOrder: 'asc' | 'desc' | null;
    fetch: boolean;
}

type Media = {
    id: string;
    name: string;
    type: string;
    key: string;
    response: any;
};

type MediaResponse = {
    mediaId: string;
    name: string;
    new?: boolean;
    url: string;
    status: string;
};
