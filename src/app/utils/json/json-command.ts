export class JsonCommand {
    ModuleName = '';
    CommandName = '';
    // Parameter: string = "";
    ParameterArray = new Array<JsonParameter>();

    public addParameter(name: string, value: any) {
        for (let item of this.ParameterArray) {
            if (item.name === name) {
                item.value = value;
                return;
            }
        }
        this.ParameterArray.push(new JsonParameter(name, value));
    }

    public toJson() {
        let parObj: any = {};
        for (let item of this.ParameterArray) {
            parObj[item.name] = item.value;
        }
        return JSON.stringify(
            {
                'ModuleName': this.ModuleName,
                'CommandName': this.CommandName,
                'Parameter': JSON.stringify(parObj)
            }
        );
    }
}

export class JsonParameter {
    constructor(public name: string, public value: any) {

    }
}