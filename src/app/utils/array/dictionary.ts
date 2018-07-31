/*
************* Implementation eines Dictionarys in Typescript ************************
* Benutzung:
* ********************************************************************************
var ages = new Dictionary<Number>();
ages.Add('Dustin', 36);
ages.Add('Amy', 25);
ages.Add('Angie', 35);
ages.Add('Josh', 4);

var hasJosh = ages.ContainsKey('Josh'); //will return true
var hasBen = ages.ContainsKey('Ben'); //will return false
var amyAge = ages.Item('Amy'); //will return 25
var keys = ages.Keys(); //will return ['Dustin', 'Amy', 'Angie', 'Josh'];
var vals = ages.Values(); //will return [36, 25, 35, 4];
var count = ages.Count(); //will return 4;

ages.Remove('Josh'); //removes Josh
count = ages.Count(); //will return 3;

*/

export interface IKeyedCollection<T> {
    Add(key: string, value: T);
    ContainsKey(key: string): boolean;
    Count(): number;
    Item(key: string): T;
    Keys(): string[];
    Remove(key: string): T;
    Values(): T[];
}

export class KeyedCollection<T> implements IKeyedCollection<T> {
    private items: { [index: string]: T } = {};

    private count: number = 0;

    public ContainsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    public Count(): number {
        return this.count;
    }

    public Add(key: string, value: T) {
        this.items[key] = value;
        this.count++;
    }

    public Remove(key: string): T {
        var val = this.items[key];
        delete this.items[key];
        this.count--;
        return val;
    }

    public Item(key: string): T {
        return this.items[key];
    }

    public Keys(): string[] {
        var keySet: string[] = [];

        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }

        return keySet;
    }

    public Values(): T[] {
        var values: T[] = [];

        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }

        return values;
    }
}