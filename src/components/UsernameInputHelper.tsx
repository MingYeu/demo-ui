import InputHelper from '@/lib/ui/InputHelper';
import { useTranslation } from 'next-i18next';

const UsernameInputHelper: React.FC = () => {
    const { t } = useTranslation(['common']);

    const usernameValidation = [
        t('minimum 4 characters'),
        t('maximum 20 characters'),
        t('start with alphabet only'),
        t('no special characters allow'),
    ];

    return (
        <InputHelper
            info={
                <ul className="!list-disc">
                    {usernameValidation.map((validation: string) => {
                        return <li key={validation}>{validation}</li>;
                    })}
                </ul>
            }
        />
    );
};

export default UsernameInputHelper;
