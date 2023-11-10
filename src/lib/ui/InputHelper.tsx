import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { ReactNode } from 'react';

interface InputHelper {
    info: string | ReactNode;
}

const InputHelper: React.FC<InputHelper> = ({ info }) => {
    return (
        <Tooltip title={info}>
            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
        </Tooltip>
    );
};

export default InputHelper;
