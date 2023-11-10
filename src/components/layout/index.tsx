import { Breadcrumb, Drawer, Layout as AntLayout } from 'antd';

import { DefaultSeoProps, NextSeo } from 'next-seo';
import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import CustomHeader from './Header';
import Image from 'next/image';
import Link from 'next/link';
import { PermissionContext } from '@/providers/DepartmentContext';
import logo from '../../../public/images/icons/Logo with Name.svg';

const { Header, Sider, Content } = AntLayout;

interface LayoutAttributes {
    children: React.ReactNode;
    staff: Staff;
    breadCrumbItems?: BreadCrumbItem[];
    activeMenu?: string[];
    activeDropdown?: string[];
    seoConfig?: DefaultSeoProps;
}

const Layout: React.FC<LayoutAttributes> = ({ children, staff, breadCrumbItems = [], activeMenu = [], activeDropdown = [], seoConfig }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const { t } = useTranslation(['layout']);
    const { setPermissions } = useContext(PermissionContext);

    useEffect(() => {
        setPermissions(staff.department);
    }, []);

    useEffect(() => {
        const isMobile = window.innerWidth <= 768;
        setIsMobile(isMobile);
        window.addEventListener('resize', () => {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                setCollapsed(true);
            }
            setIsMobile(isMobile);
        });
    }, []);

    const breadcrumbItems = [
        {
            title: <Link href="/dashboard">{t('Home')}</Link>,
        },
    ];

    for (let i = 0; i < breadCrumbItems.length; i++) {
        const item = breadCrumbItems[i];
        if (i === breadCrumbItems.length - 1) {
            breadcrumbItems.push({
                title: <span className="font-semibold">{t(item.label)}</span>,
            });
        } else {
            breadcrumbItems.push({
                title: <Link href={item.path}>{item.label}</Link>,
            });
        }
    }

    return (
        <div className="min-h-screen">
            <NextSeo {...seoConfig} />
            <AntLayout className="h-full !min-h-screen" hasSider>
                {/* {isMobile ? (
                    <Drawer
                        placement="left"
                        open={!collapsed}
                        onClose={() => setCollapsed(true)}
                        width="250px"
                        bodyStyle={{ padding: 0, backgroundColor: 'rgb(0, 21, 41)' }}
                        closable={false}
                    >
                        <div className="flex flex-col">
                            <div className="w-full duration-200 logo" style={{ padding: collapsed ? '0.5rem 1rem' : '1.25rem 2rem' }}>
                                <Image
                                    src={PIPWithNameLogo}
                                    priority={true}
                                    alt="Propagate Intellectual Property Logo"
                                    className="w-full h-full"
                                    placeholder="blur"
                                    blurDataURL="/images/icons/Logo with Name.svg"
                                />
                            </div>
                            <CustomMenu staff={staff} activeMenu={activeMenu} activeDropdown={activeDropdown} />
                        </div>
                    </Drawer>
                ) : (
                    <Sider
                        collapsedWidth={isMobile ? 0 : 65}
                        width={250}
                        trigger={null}
                        collapsible
                        collapsed={collapsed}
                        breakpoint="md"
                        onBreakpoint={(broken) => {
                            if (broken) {
                                setCollapsed(true);
                            } else {
                                setCollapsed(false);
                            }
                        }}
                        theme="dark"
                        style={{
                            overflow: 'auto',
                            height: '100vh',
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                        }}
                        zeroWidthTriggerStyle={{ position: 'absolute' }}
                    >
                        <div className="flex flex-row">
                            <div className="w-full duration-200 logo" style={{ padding: collapsed ? '0.5rem 1rem' : '1.25rem 2rem' }}>
                                <Image
                                    src={collapsed ? PIPLogo : PIPWithNameLogo}
                                    alt="Propagate Intellectual Property Logo"
                                    priority
                                    placeholder="blur"
                                    className="w-full h-full"
                                    blurDataURL="/images/icons/Logo with Name.svg"
                                />
                            </div>
                            <CustomMenu staff={staff} activeMenu={activeMenu} activeDropdown={activeDropdown} />
                        </div>
                    </Sider>
                )} */}
                <AntLayout
                    className="duration-200 site-layout"
                    // style={{ marginLeft: collapsed ? (isMobile ? '0px' : '65px') : isMobile ? '0px' : '250px' }}
                >
                    <Header className="site-layout-background" style={{ padding: 0, backgroundColor: 'transparent' }}>
                        <div className="flex justify-between px-5 bg-blue-300 ">
                            <Link href="/">
                                <Image src={logo} alt="Raymond Sensation Logo" className="w-full h-[45px] align-middle" />
                            </Link>
                            <CustomHeader
                                name={staff.englishName}
                                collapsed={collapsed}
                                setCollapsed={setCollapsed}
                                unreadMessage={staff._count?.Notification_Status}
                                staffId={staff.id}
                            />
                        </div>
                    </Header>
                    <Content className="px-5 my-6 md:mx-4 md:px-8 site-layout-background">
                        <div className="max-w-[1500px] w-full m-auto">
                            {/* Breadcrumb */}
                            <Breadcrumb className="!mb-3" separator=">" items={breadcrumbItems} />
                            <div className="px-4 md:px-8 py-[50px] bg-white rounded shadow-sm">{children}</div>
                        </div>
                    </Content>
                </AntLayout>
            </AntLayout>
        </div>
    );
};

export default Layout;
