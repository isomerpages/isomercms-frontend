import { toast } from 'react-toastify';

import Toast from '../components/Toast';

import { DEFAULT_ERROR_TOAST_MSG } from '../utils';

import elementStyles from './styles/isomer-cms/Elements.module.scss';

export function errorToast(message) {
    return toast(
        <Toast notificationType='error' text={message ? message : DEFAULT_ERROR_TOAST_MSG}/>,
        {className: `${elementStyles.toastError} ${elementStyles.toastLong}`},
    );
}

export function successToast(message) {
    toast(
        <Toast notificationType='success' text={message ? message : `Success!`}/>,
        {className: `${elementStyles.toastSuccess}`},
    );
}