"use client";

import { useState } from "react";
import {
  Table,
  Button,
  Input,
  HStack,
} from "@chakra-ui/react";
import type { User } from "@/types/user";
import { updateUserAction, deleteUserAction } from "@/lib/actions";

interface UsersTableProps {
  initialUsers: User[];
}

export default function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

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
    <Table.Root size="md" striped>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>ID</Table.ColumnHeader>
          <Table.ColumnHeader>Username</Table.ColumnHeader>
          <Table.ColumnHeader>Password</Table.ColumnHeader>
          <Table.ColumnHeader>Created At</Table.ColumnHeader>
          <Table.ColumnHeader>Actions</Table.ColumnHeader>
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
                  value={editName}
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
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => saveEdit(user.id)}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </Button>
                </HStack>
              ) : (
                <HStack gap={2}>
                  <Button size="sm" onClick={() => startEdit(user)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => removeUser(user.id)}
                  >
                    Delete
                  </Button>
                </HStack>
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
