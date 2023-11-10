import { Dispatch, SetStateAction } from 'react';
import { Avatar, Button, Divider, Dropdown, notification } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { stringAvatar, stringToColor } from '@/lib/helperFunctions';

interface HeaderAttributes {
    name: string;
    collapsed: boolean;
    unreadMessage: number;
    staffId: string;
    setCollapsed: Dispatch<SetStateAction<boolean>>;
}

const CustomHeader: React.FC<HeaderAttributes> = ({ name, collapsed, setCollapsed, unreadMessage, staffId }) => {
    const { t, i18n } = useTranslation(['layout', 'common']);
    const currentLocale = i18n.language;
    const router = useRouter();

    const logoutMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/staff/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language': currentLocale,
                },
            });
            const response = (await res.json()) as APIResponse;
            if (!response.success) {
                throw new Error(t(response.message) as string);
            }
        },
        onError: (error: Error) => {
            notification.error({
                message: t('common:Oh no! Something Went Wrong'),
                description: t(error.message as string),
            });
        },
        onSuccess: () => {
            router.push('/');
        },
    });

    return (
        <div className="flex items-center justify-center">
            <div className="flex items-center justify-center col-row">
                <div>{/* <Notification unreadMessages={unreadMessage} staffId={staffId} /> */}</div>
                <div className="mx-3">
                    <span className="font-semibold">{name}</span>
                </div>
                <Dropdown
                    trigger={['click']}
                    dropdownRender={() => {
                        return (
                            <div className="flex flex-col p-3 bg-white rounded-md shadow-md">
                                <div
                                    className="w-full text-center bg-red-600 rounded-[4px] hover:bg-red-700 duration-100 py-2 mt-2 cursor-pointer leading-[normal]"
                                    onClick={() => {
                                        logoutMutation.mutate();
                                    }}
                                >
                                    <a className="px-3 text-white hover:text-white">{t('Logout')}</a>
                                </div>
                            </div>
                        );
                    }}
                >
                    <div className="cursor-pointer">
                        <Avatar style={{ backgroundColor: stringToColor(name) }} size={35}>
                            {stringAvatar(name)}
                        </Avatar>
                    </div>
                </Dropdown>
            </div>
        </div>
    );
};

export default CustomHeader;
