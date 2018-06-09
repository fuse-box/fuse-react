export class Query {
    public static get(): { [key: string]: any } {
        // This function is anonymous, is executed immediately and
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                if (pair[0]) {
                    query_string[pair[0]] = decodeURIComponent(pair[1]);
                }

                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    }
    public static createString(data): string {
        var stringData = [];
        for (const key in data) {
            stringData.push(key + "=" + encodeURI(data[key]))
        }
        var str = stringData.join("&");
        if (stringData.length > 0) {
            str = "?" + str;
        }
        return str;
    }

    public static  merge(input: { [key: string]: any }): {
        str: string,
        obj: any
    } {
        const current = this.get()
        for (const key in input) {
            if (input[key] === undefined) {
                delete current[key]
            } else {
                current[key] = input[key];
            }
        }
        return { str: this.createString(current), obj: current }
    }
}



