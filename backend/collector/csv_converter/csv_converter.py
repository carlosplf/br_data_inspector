import csv
import logging
import os


class CSVConverter():
    def __init__(self):
        pass

    def csv_to_dict(self, filename, change_fields=False, fields_names=[], delete_after=False):
        """
        Convert a CSV to a dict.
        Args:
            filename: (str) filename.
            change_fields: (list) indicates if the system need to
                change any field name from data.
            fields_names: (list) in case of True change_fields, these
                should be the fields to be changed.
            delete_after: (bool) After processing the CSV file, delete it.
        """
        data = {}
        with open(filename, encoding='ISO-8859-1') as csv_file:
            csv_reader = csv.DictReader(csv_file, delimiter=";")
            primary_key = 0
            for rows in csv_reader:
                data[str(primary_key)] = rows
                primary_key += 1

        if change_fields:
            for single_change in fields_names:
                data = self.__change_field_name(data, single_change["current_field"], single_change["new_field"])

        if delete_after:
            os.remove(filename)

        return data

    # TODO: Deprecated. This method was created and is maybe no longer necessary.
    def __change_field_name(self, entries, current_field, new_field):
        """
        Some entries can come with different field names.
        For example: Contracts entries have the field 'CNPJ Contratado', but
        in some entries the field name is 'Código Contratado'.
        Args:
            entries: (dict) entries to be fixed.
            current_field: (str) current field name in entry.
            new_field: (str) new field name to be defined in entry.
        Return:
            (dict) Dict with the same number and sctrure from entries.
        """
        new_entries = {}

        logging.info("Changing field name. From {} to {}".format(current_field, new_field))

        for key, value in entries.items():
            new_entries[key] = value
            if current_field in value.keys():
                new_entries[key][new_field] = value[current_field]
                new_entries[key].pop(current_field)

        return new_entries
