import { View, ScrollView, Pressable, Text, Modal, Button, StyleSheet, TextInput } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import React from "react";
import { router } from "expo-router";
import { get_all_folder_names, get_all_notes, delete_folder, make_new_folder, get_all_notes_in_folder, get_note_by_id } from "@/services/logic";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


interface Note {
  note_id: string;
  note_title: string;
  note_folder: string;
  note_text: string;
  note_timing: string;
}

export default function Index() {
  const [folders, setFolders] = React.useState<string[]>(['favs', 'lols']) // Changed the type to string array
  const [notes, setNotes] = React.useState<Note[]>([]);

  const [filterFolders, setFilterFolders] = React.useState<string[]>([])


  const fetchFolders = async () => {
    const folderNames = await get_all_folder_names()
    setFolders(folderNames)
  }
  const fetchNotes = async () => {
    if (filterFolders.length === 0) {
      const allNotes = await get_all_notes();
      setNotes(allNotes);
    } else {
      const notesPromises = filterFolders.map(async (folder) => {
        const all_note_ids = await get_all_notes_in_folder(folder);
        const notes = await Promise.all(all_note_ids.map(async (id: any) => await get_note_by_id(`${id}`)));
        return notes;
      });
      const notesArray = await Promise.all(notesPromises);
      setNotes(notesArray.flat()); // Flatten the array of notes
    }
  }
  const fetchData = async () => {
    await fetchFolders();
    await fetchNotes();
  };
  fetchData();
  React.useEffect(() => {



  }, []); // Empty dependency array to run only on mount

  return (

    <View
      style={{
        flex: 1,
        backgroundColor: 'white'
      }}
    >
      <Navbar />
      <FolderBar filterFolders={filterFolders} setFilterFolders={setFilterFolders} folders={folders} setFolders={setFolders} />
      <NotesDisplay notes={notes} />
      <View style={{
        position: 'absolute',
        bottom: 8,
        right: 8,
        overflow: 'hidden',
        borderRadius: 40,
      }}>
        <Pressable
          onPress={() => {
            router.push('/write')
          }}
          android_ripple={{ color: 'gray', borderless: true }}
          style={{
            padding: 14,
            backgroundColor: '#333333', // Changed to a very dark shade of gray
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 40,
            gap: 4
          }}>
          <Feather name="edit-2" size={24} color="white" />
          <Text style={{
            color: 'white',
            fontSize: 18,
            fontWeight: '800'
          }}>Compose</Text>
        </Pressable>
      </View>
    </View >
  );
}




const Navbar = () => {
  return (<View style={{
    position: 'fixed',
    padding: 10,
    backgroundColor: "white",
    flexDirection: 'row'
  }}>
    <View
      style={{
        flexDirection: 'row',
        width: '50%',
        padding: 0,
        alignItems: "flex-start",
        justifyContent: "flex-start"
      }}
    >
      <Text style={{
        fontSize: 24,
        backgroundColor: "#333333",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        color: 'white',
        fontWeight: '700'
      }}>Notes</Text>
    </View>

    <View style={{
      flexDirection: 'row',
      width: '50%',
      padding: 2,
      alignItems: 'flex-end',
      justifyContent: 'flex-end'
    }}>
      <Pressable onPress={() => {
        router.push('/settings')
      }} style={({ pressed }) => [
        pressed && styles.onPressed
      ]}>
        <MaterialIcons name="explore" size={30} color="#ff5757" />
      </Pressable>
    </View>
  </View>)
}
interface FolderBarProps {
  folders: string[]; // Adjusted the type to string array
  setFolders: React.Dispatch<React.SetStateAction<string[]>>; // Added setFolders
  setFilterFolders: React.Dispatch<React.SetStateAction<string[]>>; // Added setFilterFolders,
  filterFolders: string[]
}
const FolderBar: React.FC<FolderBarProps> = ({ folders, setFolders, setFilterFolders, filterFolders }) => {
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false); // Separate modal for deletion
  const [createModalVisible, setCreateModalVisible] = React.useState(false); // Separate modal for creating
  const [selectedFolder, setSelectedFolder] = React.useState<string | null>(null);
  const [newFolderName, setNewFolderName] = React.useState<string>(''); // New state for folder name

  const handleLongPress = (folderName: string) => {
    setSelectedFolder(folderName);
    setDeleteModalVisible(true); // Open delete modal
  };

  const toggleFolderInFilter = (folderName: string) => {
    setFilterFolders(prev =>
      prev.includes(folderName)
        ? prev.filter(folder => folder !== folderName)
        : [...prev, folderName]
    );
  };

  const confirmDelete = async () => {
    if (selectedFolder) {
      await delete_folder(selectedFolder); // Ensure delete_folder is awaited
      setSelectedFolder(null);
      setDeleteModalVisible(false); // Close delete modal
      const updatedFolderNames = await get_all_folder_names(); // Fetch updated folders
      setFolders(updatedFolderNames);
    }
  };

  const createNewFolder = async () => {
    if (newFolderName.trim()) {
      await make_new_folder(newFolderName); // Call to create a new folder
      setNewFolderName(''); // Clear the input
      setCreateModalVisible(false); // Close the modal
      const updatedFolderNames = await get_all_folder_names(); // Fetch updated folder names
      setFolders(updatedFolderNames);
    }
  };

  return (
    <View style={{ padding: 10 }}>
      <ScrollView
        horizontal
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
      >
        <Pressable
          onPress={() => setCreateModalVisible(true)} // Open create modal
          style={({ pressed }) => [
            {
              borderRadius: 24,
              marginRight: 4,
              padding: 8,
              paddingHorizontal: 24,
              backgroundColor: "lightgray",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            },
            pressed && { backgroundColor: "gray" },
          ]}
        >
          <Feather name="folder-plus" size={20} color="gray" />
        </Pressable>
        {folders.map((folder, index) => (
          <Pressable
            key={index}
            onLongPress={() => handleLongPress(folder)}
            onPress={() => toggleFolderInFilter(folder)} // Toggle folder on single press
            style={({ pressed }) => [
              {
                borderRadius: 24,
                marginRight: 4,
                padding: 8,
                paddingHorizontal: 24,
                backgroundColor: filterFolders.includes(folder) ? "#ff5757" : "lightgray", // Change background color based on filterFolders to a premium green and gray
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              },
              pressed && { backgroundColor: "gray" },
            ]}
          >
            <Text style={{ textAlign: "center", color: filterFolders.includes(folder) ? "white" : "black" }}>{folder}</Text> {/* Change text color based on filterFolders */}
          </Pressable>
        ))}
      </ScrollView>

      {/* Confirmation Modal for Deleting Folder */}
      <Modal
        transparent={true}
        visible={deleteModalVisible} // Bind to delete modal visibility
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}
        >
          <View
            style={{
              width: 300,
              backgroundColor: "white",
              borderRadius: 20,
              alignItems: "center",
              overflow: 'hidden',
              borderColor: 'lightgray',
              borderWidth: 1,

            }}
          >
            <Text style={{ marginBottom: 20, padding: 20, }}>
              Are you sure you want to delete "{selectedFolder}"?
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Pressable

                onPress={() => setDeleteModalVisible(false)}
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  width: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopColor: 'lightgray',
                  borderTopWidth: 1,
                }}
              ><Text style={{
                color: 'blue', fontWeight: '800', fontSize: 20,
              }}>Cancel</Text></Pressable>
              <Pressable onPress={confirmDelete} style={{
                backgroundColor: 'white',
                padding: 20,
                width: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopColor: 'lightgray',
                borderLeftColor: 'lightgray',
                borderTopWidth: 1,
                borderLeftWidth: 1,
              }}><Text style={{ color: '#ff5757', fontWeight: '800', fontSize: 20, }}>Delete</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Creating New Folder */}
      <Modal
        transparent={true}
        visible={createModalVisible} // Bind to create modal visibility
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}
        >
          <View
            style={{
              width: 300,
              backgroundColor: "white",
              borderRadius: 20,
              alignItems: "center",
              overflow: 'hidden',
              borderColor: 'lightgray',
              borderWidth: 1,

            }}
          >
            <View style={{
              padding: 20,
              width: '90%'
            }}>
              <TextInput
                value={newFolderName}
                onChangeText={setNewFolderName}
                placeholder="Folder Name"
                style={{
                  width: '100%',
                  fontWeight: '600',
                  borderRadius: 20,
                  marginBottom: 20,
                  padding: 10,
                  fontSize: 23,
                }}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Pressable
                onPress={() => setCreateModalVisible(false)}
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  width: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopColor: 'lightgray',
                  borderTopWidth: 1,
                }}
              ><Text style={{
                color: 'blue', fontWeight: '800', fontSize: 20
              }}>Cancel</Text></Pressable>
              <Pressable onPress={createNewFolder} style={{
                backgroundColor: 'white',
                padding: 20,
                width: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopColor: 'lightgray',
                borderLeftColor: 'lightgray',
                borderTopWidth: 1,
                borderLeftWidth: 1,
              }}><Text style={{
                color: '#ff5757', fontWeight: '800', fontSize: 20
              }}>Create Folder</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

interface NotesDisplayProps {
  notes: Note[];
}
const NotesDisplay: React.FC<NotesDisplayProps> = ({ notes }) => {
  return (
    <ScrollView style={{ padding: 10, paddingBottom: 20, }}>
      {notes.map((note) => (
        <Pressable
          key={note.note_id}
          style={({ pressed }) => [
            {
              borderColor: 'lightgray',
              borderRadius: 24,
              borderWidth: 1,
              padding: 10,
              marginBottom: 4,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            },
            pressed && styles.onPressed2,
          ]}
        >
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '900',
              fontSize: 30,
            }}
          >
            {note.note_title}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 14,
              color: 'gray',
            }}
          >
            {note.note_text}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  onPressed: {
    opacity: 0.6
  },
  onPressed2: {
    backgroundColor: 'lightgray',
    transform: [{ scale: 0.95 }],
    transitionDuration: '100ms', // Changed to 100ms
  }
})