def transform_data_in_list(query_result, key_field="", remove_duplicated=False):
        """
        Return a LIST with all data collected.
        Args:
            query_result: Mongo query Object.
            key_field: (str) Key field from the query used for filtering.
            remove_duplicated: (bool) If true, call the remove_duplicated_entries.
        """
        all_data = []
        for data_entry in query_result:
            data_as_dict = dict(data_entry)
            data_as_dict.pop("_id", None)
            all_data.append(data_as_dict)

        if remove_duplicated:
            all_data = remove_duplicated_entries(all_data, key_field)
        
        return all_data

def remove_duplicated_entries(original_list, key_field):
    """
    Remove duplicated entries from BD.
    Args:
        original_list: (list) List with all elements.
        key_field: (str) Key field from the query used for filtering.
    """
    buffer_ids_list = []
    new_data_list = []
    id_key_field = key_field

    for data in original_list:
        if data[id_key_field] not in buffer_ids_list:
            buffer_ids_list.append(data[id_key_field])
            new_data_list.append(data)

    return new_data_list

def transform_data_in_dict(query_result, key_field):
    """
    Return a DICT with all data collected. Each dict key is the Entity ID, removing duplicates.
    Args:
        query_result: Mongo query Object.
        key_field: (str) Key field from the query used for filtering.
    """
    all_data = {}
    id_key_field = key_field
    for data_entry in query_result:
        data_entry.pop("_id", None)
        all_data[data_entry[id_key_field]] = data_entry
    return all_data
