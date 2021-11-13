export default class Utils {
    sortData(typeSort: string, orderColumn: string, array: Array<any>, orderBy: number) {
        if (typeSort == 'string') {
            return this.sortString(orderColumn, array, orderBy);
        } else {
            return this.sortByDateOrNumber(orderColumn, array, orderBy, typeSort);
        }
    }

    sortString(orderColumn: string, array: Array<any>, orderBy: number) {
        array.sort(function (a, b) {
            if (a[orderColumn].toLowerCase() > b[orderColumn].toLowerCase()) {
                return 1;
            }
            if (a[orderColumn].toLowerCase() < b[orderColumn].toLowerCase()) {
                return -1;
            }

            return 0;
        })
        if (orderBy == 2) { array.reverse() }

        return array;
    }

    sortByDateOrNumber(orderColumn: string, array: Array<any>, orderBy: number, typeSort:string) {
        if(typeSort == 'number') {
            array.sort((a, b) => {
                return a[orderColumn] - b[orderColumn]
            });
        }else {
            array.sort((a, b) => {
                a = this.convertDateToNumberWithHours(a[orderColumn]);
                b = this.convertDateToNumberWithHours(b[orderColumn]);
                return a - b
            });
        }

        if(orderBy == 2) { array.reverse() }
        return array;
    }

    convertDateToNumberWithHours(value: any) {
        const date = new Date(value);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hour = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const format = date.getFullYear() + month + day + hour + minutes;
        return format != '31/12/1969' ? format : null;
    }
}