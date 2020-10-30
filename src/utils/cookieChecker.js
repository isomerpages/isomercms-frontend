export const doesHttpOnlyCookieExist = (cookieName) => {
    const d = new Date();
    d.setTime(d.getTime() + (1000));
    const expires = "expires=" + d.toUTCString();

    document.cookie = cookieName + "=new_value;path=/;" + expires;
    if (document.cookie.indexOf(cookieName + '=') == -1) {
        return true;
    } else {
        return false;
    }
}