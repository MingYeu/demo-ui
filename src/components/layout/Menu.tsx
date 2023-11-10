import { Menu } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { PieChartOutlined } from '@ant-design/icons';

interface CustomMenuProps {
    staff: Staff;
    activeMenu: string[];
    activeDropdown: string[];
}

const CustomMenu: React.FC<CustomMenuProps> = ({ staff, activeMenu, activeDropdown }) => {
    const { t } = useTranslation(['layout']);
    const router = useRouter();
    const [selectedKeys, setSelectedKeys] = useState<string[]>(activeMenu);
    const [openKeys, setOpenKeys] = useState<string[]>(activeDropdown);
    const { department } = staff;

    const onSelectMenuHandler = (menu: string, path: string) => {
        setSelectedKeys([menu]);
        router.push(path);
    };

    const onSelectDropdownMenuHandler = (menu: { key: string }) => {
        if (openKeys.includes(menu.key)) {
            setOpenKeys(openKeys.filter((key) => key !== menu.key));
        } else {
            setOpenKeys([...openKeys, menu.key]);
        }
    };

    const menuItems = [
        {
            key: 'dashboard',
            label: t('menu.Dashboard'),
            icon: <PieChartOutlined className="!text-base" />,
            onClick: () => onSelectMenuHandler('dashboard', '/dashboard'),
        },
    ];

    return <Menu theme="dark" mode="inline" defaultOpenKeys={openKeys} defaultSelectedKeys={selectedKeys} items={menuItems} />;
};

export default CustomMenu;
