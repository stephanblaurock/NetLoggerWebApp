export interface JsonCommandRetValue {
    ReturnCode: number;
    ReturnMessage: string;
    ReturnValue: string;
}

export class JsonCommandRetValue {
    ReturnCode = 0;
    ReturnMessage = '';
    ReturnValue = '';
}