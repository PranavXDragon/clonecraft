import { useState, useEffect } from 'react'
import { Container, Title, Text, Table, Card, Stack, TextInput, Group, ActionIcon, Button } from '@mantine/core'
import { IconSearch, IconTrash } from '@tabler/icons-react'
import { supabase } from '../lib/supabaseClient'

interface Assignment {
  id?: string
  team: string
  website: string
  created_at?: string
}

export function CloneCraftResults() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [search, setSearch] = useState('')

  const fetchAssignments = async () => {
    const { data, error } = await supabase
      .from('clonecraft_assignments')
      .select('*')
      .order('created_at', { ascending: true })
      
    if (data && !error) {
      setAssignments(data)
    }
  }

  useEffect(() => {
    fetchAssignments()
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clonecraft_assignments' },
        (payload) => {
          fetchAssignments()
        }
      )
      .subscribe()
      
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleDelete = async (teamName: string) => {
    if (confirm(`Are you sure you want to delete the assignment for ${teamName}?`)) {
      await supabase.from('clonecraft_assignments').delete().eq('team', teamName)
      // Realtime subscription will update the list
    }
  }

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to CLEAR ALL assignments? This cannot be undone.")) {
      // Supabase has no direct "delete all" without a filter using the JS client
      // A trick is to delete where id is not null
      await supabase.from('clonecraft_assignments').delete().neq('team', 'NON_EXISTENT_DUMMY')
    }
  }

  const filteredAssignments = assignments.filter(a => 
    a.team.toLowerCase().includes(search.toLowerCase()) || 
    a.website.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div style={{ textAlign: 'center' }}>
          <Title order={1} variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
            Clone Craft - Problem Statements
          </Title>
          <Text c="dimmed" size="lg" mt="sm">
            Live updates of teams and their allocated websites
          </Text>
        </div>

        <Card withBorder radius="lg" shadow="sm">
          <Group justify="space-between" mb="lg">
            <Group>
              <Title order={3}>Allotment Results ({assignments.length})</Title>
              {assignments.length > 0 && (
                <Button variant="subtle" color="red" size="sm" onClick={handleClearAll} leftSection={<IconTrash size={16} />}>
                  Clear All
                </Button>
              )}
            </Group>
            <TextInput
              placeholder="Search teams or websites..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              w={{ base: '100%', sm: 300 }}
            />
          </Group>

          {filteredAssignments.length > 0 ? (
            <Table.ScrollContainer minWidth={500}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>#</Table.Th>
                    <Table.Th>Team Name</Table.Th>
                    <Table.Th>Allocated Website</Table.Th>
                    <Table.Th w={100} ta="center">Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredAssignments.map((a, i) => (
                    <Table.Tr key={a.team}>
                      <Table.Td>{i + 1}</Table.Td>
                      <Table.Td fw={600}>{a.team}</Table.Td>
                      <Table.Td>
                        <Text component="a" href={a.website} target="_blank" rel="noreferrer" c="blue" fw={500}>
                          {a.website}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        <ActionIcon color="red" variant="subtle" onClick={() => handleDelete(a.team)} title="Delete assignment">
                          <IconTrash size={18} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          ) : (
            <Text c="dimmed" fs="italic" ta="center" py="xl">
              {assignments.length === 0 ? "No problem statements have been allocated yet." : "No results found."}
            </Text>
          )}
        </Card>
      </Stack>
    </Container>
  )
}
