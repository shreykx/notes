import * as FileSystem from 'expo-file-system';

// Path to the JSON file (where folder data is stored)
const filePath = FileSystem.documentDirectory + "data.json";
// Function to initialize the JSON file
async function initializeDataFile() {
    try {
        const fileExists = await FileSystem.getInfoAsync(filePath);
        if (!fileExists.exists) {
            // Create the file with an empty object
            await FileSystem.writeAsStringAsync(filePath, JSON.stringify({}));
            console.log("Initialized data.json file");
        } else {
            console.log("data.json file already exists");
        }
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}
// Function to read data from the JSON file
async function readData() {
    try {
        const fileContent = await FileSystem.readAsStringAsync(filePath);
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading data:', error);
        return {};
    }
}

// Function to write data to the JSON file
async function writeData(data: any) {
    try {
        await FileSystem.writeAsStringAsync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing data:', error);
    }
}
initializeDataFile();

export async function make_new_folder(folder_name: string) {
    const data = await readData();
    if (!data[folder_name]) {
        data[folder_name] = {};
        await writeData(data);
    }
}
export async function delete_folder(folder_name: string) {
    const data = await readData();
    if (data[folder_name]) {
        delete data[folder_name];
        await writeData(data);
    }
}


export async function get_all_folder_names() {
    const data = await readData();
    return Object.keys(data);
}

export async function get_all_notes_in_folder(folder_name: string) {
    const data = await readData();
    return data[folder_name] ? Object.keys(data[folder_name]) : [];
}

export async function create_note_in_folder(note_title: string, note_text: string, note_data: string, folder_name: string) {
    const data = await readData();

    const note_id = `note_${new Date().getTime()}`;
    const note = {
        note_id,
        note_title,
        note_text,
        date_of_note: note_data,
    };

    if (!data[folder_name]) {
        data[folder_name] = {};
    }

    data[folder_name][note_id] = note;
    await writeData(data);
}

export async function remove_note_from_folder(note_id: string, folder_name: string) {
    const data = await readData();

    if (data[folder_name] && data[folder_name][note_id]) {
        delete data[folder_name][note_id];
        await writeData(data);
    }
}

export async function get_all_notes() {
    const data = await readData();
    const allNotes = [];

    for (const folder_name in data) {
        const notesInFolder = data[folder_name];
        for (const note_id in notesInFolder) {
            allNotes.push(notesInFolder[note_id]);
        }
    }

    return allNotes;
}