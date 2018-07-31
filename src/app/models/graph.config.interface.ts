import {GraphWidgetConfig, Plant, GraphWidgetSeries} from './interfaces';


export class GraphHelper {
    static createGraphWidgetConfigForFeistle(): GraphWidgetConfig {
        let config = new GraphWidgetConfig();
        config.cust_id = 11;
        config.predefined_time_range = 'yesterday';
        config.date_begin = undefined;
        config.date_end = undefined;
        config.precision = '1h';
        config.stacked_1_series_type = 'areaspline';
        config.stacked_2_series_type = '';
        let s1 = new GraphWidgetSeries();
        s1.devices = [{caption: 'Leistung AC WR 1', value: 6}];
        s1.color = '#F79646';
        s1.caption = 'Leistung AC WR 1';
        s1.unit = 'kWh';
        s1.series_type = 'areaspline';
        s1.only_sum_values = false;
        config.series.push(s1);
        let s2 = new GraphWidgetSeries();
        s2.devices = [{caption: 'Leistung AC WR 2', value: 14}];
        s2.color = '#1F497D';
        s2.caption = 'Leistung AC WR 2';
        s2.unit = 'kWh';
        s2.series_type = 'areaspline';
        s2.only_sum_values = false;
        config.series.push(s2);
        let s3 = new GraphWidgetSeries();
        s3.devices = [{caption: 'Leistung AC WR 3', value: 17}];
        s3.color = '#1F497D';
        s3.caption = 'Leistung AC WR 3';
        s3.unit = 'kWh';
        s3.series_type = 'areaspline';
        s3.only_sum_values = false;
        config.series.push(s3);
        return config;
    }

    static createGraphWidgetConfigForDevice(cust_id: number, device_id: number, device_caption: string, unit: string, only_sum_values: boolean, predefinedTimeRange: string): GraphWidgetConfig {
        let s1 = new GraphWidgetSeries();
        s1.devices = [{caption: device_caption, value: device_id}];
        s1.color = '#F79646';
        s1.caption = device_caption;
        s1.unit = unit;
        s1.series_type = 'area';
        s1.only_sum_values = only_sum_values;
        return {
            cust_id: cust_id,
            predefined_time_range: predefinedTimeRange,
            //predefined_time_range_offset: 0,
            //predefined_time_range_offset_label: '',
            date_begin: undefined,
            date_end: undefined,
            precision: '1m',
            stacked_1_series_type: 'area',
            stacked_2_series_type: '',
            categories: [],
            series: [
                s1
            ]
        }
    }


    static CreateDemoConfig(): GraphWidgetConfig {
        return {
            cust_id: 2,
            predefined_time_range: 'yesterday',
            //predefined_time_range_offset: 0,
            //predefined_time_range_offset_label: '',
            date_begin: new Date('2017-01-23T00:00:00.000'),
            date_end: new Date('2017-01-24T23:59:00.000'),
            precision: '1m',
            stacked_1_series_type: '',
            stacked_2_series_type: '',
            categories: [],
            series: [
                /*
                 {
                 device_id: 1,
                 color: '#123456',
                 caption: 'TestGraph',
                 only_sum_values: false,
                 sum_values: {
                 avg: 0,
                 sum: 0,
                 max: 0,
                 min: 0,
                 start: 0,
                 end: 0
                 },
                 values: []
                 }
                 */
            ]
        }
    }

    static CreateDemoPlants(): Plant[] {
        return [{
            plant_id: 1,
            parent_plant_id: 0,
            caption: 'PV-Anlage Verwaltung',
            description: 'PV-Anlage Verwaltungsgebäude mit Yingli-Solar-Panels. Insgesamt 43kWP',
            graph_config: {
                cust_id: 2,
                predefined_time_range: 'yesterday',
                //predefined_time_range_offset: 0,
                //predefined_time_range_offset_label: '',
                date_begin: new Date('2017-01-23T00:00:00.000'),
                date_end: new Date('2017-01-24T23:59:00.000'),
                precision: '1m',
                stacked_1_series_type: '',
                stacked_2_series_type: '',
                categories: [],
                series: []
            }
        }];
    }
}