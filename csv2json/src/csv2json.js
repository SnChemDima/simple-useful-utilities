export class CSVConvertionResult {
    constructor(message, status, value = undefined) {
        this.message = message;
        this.status = status;
        this.value = value;
    }
}

function parse_line(line, trim_spaces) {
    let cell = '';
    let result = [];
    let state = 0; //0 - cell; 1 - inside quotes; 2 - cell started
    for (let j = 0; j < line.length; j++) {
        const sym = line[j];
        if (sym === ',' && (state === 0 || state === 2)) {
            result.push(cell);
            cell = '';
            state = 0;
            continue;
        }
        else if (sym === '"') {
            if (state === 0) {
                state = 1;
                continue;
            }
            if (state === 1) {
                if (j + 1 < line.length) {
                    const next_symb = line[j + 1];
                    if (next_symb === '"') {
                        cell += '"';
                        j++;
                    }
                    else {
                        state = 2;
                    }
                }
                else
                    state = 2;
                continue;
            }
        }
        else if (trim_spaces && sym === ' ' && state === 0) {
            continue;
        }
        else {
            cell += sym;
            if (state === 0)
                state = 2;
        }
    }
    result.push(cell);
    return result;
}

export function convertCsv2Json(csv_text, use_first_line_as_col_names = true, trim_spaces = true) {
    if (typeof(csv_text) != typeof('a'))
        return new CSVConvertionResult('Input parameter is not a text', false);
    const prepared_text = csv_text.trim().replace('\r', '');
    if (!prepared_text)
        return new CSVConvertionResult('Empty CSV content', false);
    const lines = prepared_text.split('\n');
    if (lines.length == 0)
        return new CSVConvertionResult('Empty CSV content', false);

    const first_line_parsed = parse_line(lines[0], trim_spaces);
    const col_names = use_first_line_as_col_names ? first_line_parsed : [...Array(first_line_parsed.length).keys()];
    let out_json = new Map();
    col_names.forEach(line => { out_json[line] = []; });
    for (let i = use_first_line_as_col_names ? 1 : 0; i < lines.length; i++) {
        const line = lines[i];
        const parsed_line = parse_line(line, trim_spaces);
        if (parsed_line.length != col_names.length)
            return new CSVConvertionResult(
                `Column at line ${i+1} has ${cell_index + 1} columns. Expected: ${col_names.length}.`,
                false);
        for (let j = 0; j < parsed_line.length; j++) {
            out_json[col_names[j]].push(parsed_line[j]);
        }
    }
    return new CSVConvertionResult('', true, out_json);
}