import { Button, Form, Input } from 'antd';
import { NextPage, GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import router from 'next/router';
import Image from 'next/image';
import PIPLogo from '@public/images/icons/Logo with Name.svg';

import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Toast from '@/lib/Toast';
import { PasswordRules } from '@/lib/inputRules';

interface TokenVerificationProps {
    staff: Staff;
    token: string;
}

const TokenVerification: NextPage<TokenVerificationProps> = ({ staff, token }) => {
    const { t, i18n } = useTranslation(['resetPassword', 'messages']);
    const currentLocale = i18n.language;
    const [resetPasswordForm] = Form.useForm();
    const verifyNotify = new Toast('Verify Token');
    const [isDisable, setIsDisable] = useState<boolean>(false);

    useEffect(() => {
        resetPasswordForm.setFieldsValue({
            email: staff.email,
        });
    }, []);

    const verifyTokenMutation = useMutation({
        mutationFn: async (formValues: Staff) => {
            verifyNotify.loading(t('messages:loading.resettingPassword'));
            const res = await fetch(`/api/staff/auth/resetPassword/${staff.id}/${token}`, {
                method: 'PUT',
                headers: {
                    'accept-language': currentLocale,
                    'content-type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formValues),
            });
            const response = (await res.json()) as APIResponse;
            if (!response.success) {
                throw new Error(t(response.message) as string);
            }
            return response.data;
        },
        onError: (error: Error) => {
            verifyNotify.update('error', t(error.message) as string);
            setIsDisable(false);
        },
        onSuccess: () => {
            let countDown = 4;
            const timer = setInterval(() => {
                countDown -= 1;
                verifyNotify.update(
                    'success',
                    t('messages:success.passwordHasBeenResetSuccessfully!youWillNowBeRedirectedToHomePageIn{{countDown}}seconds', {
                        countDown,
                    })
                );
            }, 1000);

            setTimeout(() => {
                clearInterval(timer);
            }, countDown * 1000);

            setTimeout(() => {
                router.push('/');
            }, 4000);
        },
    });

    const onVerifyHandler = () => {
        setIsDisable(true);
        resetPasswordForm.validateFields().then(async (values: Staff) => {
            verifyTokenMutation.mutate(values);
        });
    };

    return (
        <div>
            <div className="flex items-center justify-center w-full h-screen loginBackground">
                <div className="w-[100%] max-w-[400px] flex flex-col justify-center p-5">
                    <div className="absolute top-5 right-5">
                        <LanguageSwitcher />
                    </div>
                    <div className="p-3 mb-6 text-center bg-green-900 rounded-lg logo">
                        <Image src={PIPLogo} alt="Propagate Intellectual Property Logo" className="w-full h-full mx-auto" />
                    </div>
                    <div className="">
                        <Form form={resetPasswordForm} name="login_form" layout="vertical">
                            <Form.Item className="white_label" name="email" label={t('email')}>
                                <Input disabled />
                            </Form.Item>
                            <Form.Item className="white_label" name="password" label={t('password')} rules={[{ required: true }, ...PasswordRules()]}>
                                <Input.Password min={6} />
                            </Form.Item>
                            <Button type="primary" block disabled={isDisable} onClick={onVerifyHandler}>
                                {verifyTokenMutation.isLoading ? <LoadingOutlined /> : t('button.resetPassword')}
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenVerification;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const tokenChecker = await fetch(process.env.api_url + `/api/staff/auth/resetTokenVerifier/${context.params!.staffId}/${context.params!.token}`, {
        method: 'GET',
    });

    const tokenCheckerResponse = (await tokenChecker.json()) as APIResponse;

    if (!tokenCheckerResponse.success) {
        // if (tokenCheckerResponse.resendEmailVerification) {
        //     return {
        //         redirect: {
        //             destination: '/?resendEmailVerification=true',
        //             permanent: false,
        //         },
        //     };
        // }
        return {
            redirect: {
                destination: '/404',
                permanent: false,
            },
        };
    }

    return {
        props: {
            staff: tokenCheckerResponse.data,
            token: context.params!.token,
            ...(await serverSideTranslations(context.locale as string, ['resetPassword', 'layout', 'common', 'messages'])),
        },
    };
};
