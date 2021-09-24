export default function (test : boolean, message : string) {
    if (test)
        throw message;
    else return false;
}
