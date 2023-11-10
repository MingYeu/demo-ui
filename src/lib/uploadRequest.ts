const uploadRequest = async (url: string, option: any): Promise<void> => {
    const formData = new FormData();
    formData.append('file', option.file);

    const res = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    const response = (await res.json()) as unknown as MediaResponse;

    option.onSuccess(response);
};

export default uploadRequest;
