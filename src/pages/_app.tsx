import '@/styles/globals.css';
import { ConfigProvider } from 'antd';
import { DefaultSeo } from 'next-seo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Ubuntu } from 'next/font/google';
import { useTranslation, appWithTranslation } from 'next-i18next';
import NextNProgress from 'nextjs-progressbar';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import en_GB from 'antd/locale/en_GB';
import zh_HK from 'antd/locale/zh_HK';
import 'dayjs/locale/en-gb';
import 'dayjs/locale/zh-hk';
import useIsMounted from '@/hooks/useIsMounted';
import { PLATFORM_NAME, TOAST_AUTO_CLOSE } from '@/const';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PermissionProvider from '@/providers/DepartmentContext';

const ubuntu = Ubuntu({
    weight: ['400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-ubuntu',
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});

function App({ Component, pageProps }: AppProps) {
    // const { t } = useTranslation('messages');
    const router = useRouter();

    const antdGlobalLocale = () => {
        switch (router.locale) {
            case 'zh-HK':
                return zh_HK;
            default:
                return en_GB;
        }
    };

    dayjs.locale(router.locale?.toLowerCase() || 'en-gb');

    const globalConfig = {
        autoInsertSpaceInButton: false,
        locale: antdGlobalLocale(),
        form: {
            validateMessages: {
                // required: t('error.required', { label: '${label}' }),
                required: 'error required',
                types: {
                    // email: t('error.invalid', { label: '${label}' }),
                    email: 'error invalid email',
                },
            },
            scrollToFirstError: true,
        },
    };

    return (
        <PermissionProvider>
            <QueryClientProvider client={queryClient}>
                <ConfigProvider {...globalConfig}>
                    <DefaultSeo
                        title={undefined}
                        defaultTitle={PLATFORM_NAME}
                        titleTemplate={`%s | ${PLATFORM_NAME}`}
                        description="RTM System"
                        additionalLinkTags={[
                            {
                                rel: 'icon',
                                href: '/images/icons/favicon.ico?',
                            },
                        ]}
                    />
                    <NextNProgress />
                    <main
                        style={{ visibility: useIsMounted() ? 'visible' : 'hidden' }}
                        className={`${ubuntu.variable} ${ubuntu.className} font-ubuntu`}
                    >
                        <Component {...pageProps} />
                        <ToastContainer autoClose={TOAST_AUTO_CLOSE} closeOnClick={false} />
                    </main>
                </ConfigProvider>
                <ReactQueryDevtools />
            </QueryClientProvider>
        </PermissionProvider>
    );
}

// export default appWithTranslation(App);
export default App;
