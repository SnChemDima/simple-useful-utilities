import { convertCsv2Json } from "./csv2json.js"

const input_csv_field = document.getElementById("csvfilecontent");
const input_json_field = document.getElementById("jsonfilecontent");
const error_label = document.getElementById("errorlabel");
const use_first_line_as_col_name = document.getElementById("use_first_line_as_col_name");
const trim_spaces = document.getElementById("trim_spaces");

function clean() {
    error_label.innerText = '\xa0';
    input_json_field.value = '';
}

function convert() {
    clean();
    const convertion_result = convertCsv2Json(
        input_csv_field.value,
        use_first_line_as_col_name.checked,
        trim_spaces.checked
    );
    if (!convertion_result.status) {
        error_label.innerText = convertion_result.message;
        return;
    }
    input_json_field.value = JSON.stringify(convertion_result.value, undefined, 2);
}

document.getElementById("convertbtn").addEventListener("click", convert);
clean();