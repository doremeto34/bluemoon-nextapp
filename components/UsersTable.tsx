"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  HStack,
  IconButton
} from "@chakra-ui/react";
import type { User } from "@/types/user";
import { updateUserAction, deleteUserAction } from "@/lib/actions";
import { getUsersAction } from "@/lib/actions";
import { FiEdit, FiTrash2 , FiSave, FiX, FiDollarSign } from "react-icons/fi";

export default function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUsersAction();
      setUsers(data);
    };
    fetchData();
  },[]);

  function startEdit(user: User) {
    setEditingId(user.id);
    setEditName(user.username);
  }

  async function saveEdit(id: number) {
    const res = await updateUserAction(id, { username: editName });
    if (!res.error) {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, username: editName } : u))
      );
      setEditingId(null);
    }
  }

  async function removeUser(id: number) {
    const res = await deleteUserAction(id);
    if (!res.error) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  }

  return (
    <Table.Root size="sm" variant="outline" rounded="lg" overflow="hidden">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader w="10%">ID</Table.ColumnHeader>
          <Table.ColumnHeader w="30%">Username</Table.ColumnHeader>
          <Table.ColumnHeader w="20%">Password</Table.ColumnHeader>
          <Table.ColumnHeader w="25%">Created At</Table.ColumnHeader>
          <Table.ColumnHeader w="15%">Actions</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {users.map((user) => (
          <Table.Row key={user.id}>
            <Table.Cell>{user.id}</Table.Cell>

            <Table.Cell>
              {editingId === user.id ? (
                <Input
                  size="sm"
                  w="50%"
                  value={editName}
                  colorPalette="teal"
                  onChange={(e) => setEditName(e.target.value)}
                />
              ) : (
                user.username
              )}
            </Table.Cell>

            <Table.Cell>
              {user.password}
            </Table.Cell>

            <Table.Cell>
              {new Date(user.created_at).toLocaleString()}
            </Table.Cell>

            <Table.Cell>
              {editingId === user.id ? (
                <HStack gap={2}>
                  <IconButton
                    size="sm"
                    rounded="full"
                    variant="outline"
                    colorPalette="gray"
                    onClick={() => saveEdit(user.id)}
                  >
                    <FiSave/>
                  </IconButton>
                  <IconButton
                    size="sm"
                    rounded="full"
                    variant="outline"
                    colorPalette="red"
                    onClick={() => setEditingId(null)}
                  >
                    <FiX/>
                  </IconButton>
                </HStack>
              ) : (
                <HStack gap={2}>
                  <IconButton
                    size="sm"
                    rounded="full"
                    variant="outline"
                    colorPalette="gray"
                    onClick={() => startEdit(user)}
                  >
                    <FiEdit/>
                  </IconButton>
                  <IconButton
                    size="sm"
                    rounded="full"
                    variant="outline"
                    colorPalette="red"
                    onClick={() => removeUser(user.id)}
                  >
                    <FiTrash2 />
                  </IconButton>
                </HStack>
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
