export function responseError(response) {
    throw new Error(`${response.status} ${response.statusText}`);
}
