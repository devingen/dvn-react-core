import { DateInput } from './index';

describe('initialisation', () => {

  it('should return date input', () => {
    expect(
      new DateInput('date', 'Date', 'Select date', 'Lets user select a day with month and year.')
      .setDateFormat('DD/MM/YYYY')
    ).toEqual({
      'dateFormat': 'DD/MM/YYYY',
      'description': 'Lets user select a day with month and year.',
      'id': 'date',
      'inputType': 'date',
      'placeholder': 'Select date',
      'render': expect.any(Function),
      'timeFormat': 'HH:mm:ss',
      'title': 'Date',
      'type': 'date'
    });
  });

  it('should return time input', () => {
    expect(
      new DateInput('time', 'Time', 'Select time', 'Lets user select date and time.')
      .setTimeFormat('HH:mm')
      .setInputType('time')
      .setTimePlaceholder('Select time')
    ).toEqual({
        'dateFormat': 'YYYY-MM-DD',
        'description': 'Lets user select date and time.',
        'id': 'time',
        'inputType': 'time',
        'placeholder': 'Select time',
        'render': expect.any(Function),
        'timeFormat': 'HH:mm',
        'timePlaceholder': 'Select time',
        'title': 'Time',
        'type': 'date'
      }
    );
  });

  it('should return date time input', () => {
    expect(
      new DateInput('dateTime', 'Date Time', 'Select date', 'Lets user select date and time.')
      .setInputType('dateTime')
      .setTimePlaceholder('Select time')
    ).toEqual({
      'dateFormat': 'YYYY-MM-DD',
      'description': 'Lets user select date and time.',
      'id': 'dateTime',
      'inputType': 'dateTime',
      'placeholder': 'Select date',
      'render': expect.any(Function),
      'timeFormat': 'HH:mm:ss',
      'timePlaceholder': 'Select time',
      'title': 'Date Time',
      'type': 'date'
    });
  });

  it('should return date time preview', () => {
    expect(
      new DateInput('birthDate', 'Date of Passing', '', '')
      .setDateFormat('DD MMM YYYY - HH:mm')
      .setInputType('dateTime')
      .showPreview()
      .setValue(new Date(1938, 9, 10, 9, 5))
    ).toEqual({
      'dateFormat': 'DD MMM YYYY - HH:mm',
      'description': '',
      'id': 'birthDate',
      'inputType': 'dateTime',
      'placeholder': '',
      'preview': true,
      'render': expect.any(Function),
      'timeFormat': 'HH:mm:ss',
      'title': 'Date of Passing',
      'type': 'date',
      'value': new Date(1938, 9, 10, 9, 5)
    });
  });

});

