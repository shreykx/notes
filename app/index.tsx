import { View, ScrollView, Pressable, Text, Modal, Button, StyleSheet, TextInput } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import React from "react";
import { router } from "expo-router";
import { get_all_folder_names, get_all_notes, delete_folder, make_new_folder } from "@/services/logic";


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
  const fetchFolders = async () => {
    const folderNames = await get_all_folder_names()
    setFolders(folderNames)
  }
  const fetchNotes = async () => {
    const allNotes = await get_all_notes();
    console.log(allNotes);
    setNotes(allNotes);
    return;
  }
  const fetchData = async () => {
    await fetchFolders();
    await fetchNotes();
  };
  React.useEffect(() => {


    fetchData();
  }, []); // Empty dependency array to run only on mount

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white'
      }}
    >
      <Navbar />
      <FolderBar folders={folders} setFolders={setFolders} />
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
        padding: 2,
        alignItems: "flex-start",
        justifyContent: "flex-start"
      }}
    >
      <Text style={{
        fontSize: 24,
        fontWeight: '800'
      }}>Notes</Text>
    </View>

    <View style={{
      flexDirection: 'row',
      width: '50%',
      padding: 2,
      alignItems: 'flex-end',
      justifyContent: 'flex-end'
    }}>
      <Pressable style={({ pressed }) => [
        pressed && styles.onPressed
      ]}>
        <Feather name="compass" size={24} color="black" />
      </Pressable>
    </View>
  </View>)
}
interface FolderBarProps {
  folders: string[]; // Adjusted the type to string array
  setFolders: React.Dispatch<React.SetStateAction<string[]>>; // Added setFolders
}
const FolderBar: React.FC<FolderBarProps> = ({ folders, setFolders }) => {
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false); // Separate modal for deletion
  const [createModalVisible, setCreateModalVisible] = React.useState(false); // Separate modal for creating
  const [selectedFolder, setSelectedFolder] = React.useState<string | null>(null);
  const [newFolderName, setNewFolderName] = React.useState<string>(''); // New state for folder name

  const handleLongPress = (folderName: string) => {
    setSelectedFolder(folderName);
    setDeleteModalVisible(true); // Open delete modal
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
            <Text style={{ textAlign: "center" }}>{folder}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Confirmation Modal for Deleting Folder */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible} // Bind to delete modal visibility
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              width: 300,
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ marginBottom: 20 }}>
              Are you sure you want to delete "{selectedFolder}"?
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <Button
                title="Cancel"
                onPress={() => setDeleteModalVisible(false)}
                color="gray"
              />
              <Button title="Delete" onPress={confirmDelete} color="red" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Creating New Folder */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={createModalVisible} // Bind to create modal visibility
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              width: 300,
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ marginBottom: 20 }}>Enter new folder name:</Text>
            <TextInput
              value={newFolderName}
              onChangeText={setNewFolderName}
              placeholder="Folder Name"
              style={{
                borderWidth: 1,
                borderColor: 'lightgray',
                width: '100%',
                marginBottom: 20,
                padding: 10,
              }}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <Button
                title="Cancel"
                onPress={() => setCreateModalVisible(false)}
                color="gray"
              />
              <Button title="Create" onPress={createNewFolder} color="blue" />
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
    transitionDuration: '1s',
  }
})