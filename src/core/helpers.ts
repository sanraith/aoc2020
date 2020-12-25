/**
 * Executes the regular expression over and over on the given text until all matches are found.
 * @param regex The regular expression.
 * @param text The text.
 */
function regexGetAllResults(regex: RegExp, text: string) {
    const results: RegExpExecArray[] = [];
    let record: RegExpExecArray;
    while (record = regex.exec(text)) {
        results.push(record);
    }

    return results;
}

function timeoutAsync(timeMs: number = undefined): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), timeMs));
}

export {
    timeoutAsync,
    regexGetAllResults
};