import { useState, useEffect } from 'react'
import { Container, Title, Text, Table, Card, Stack, TextInput, Group, ActionIcon, Button } from '@mantine/core'
import { IconSearch, IconTrash } from '@tabler/icons-react'

interface Assignment {
  team: string
  website: string
}

export function CloneCraftResults() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    // Read saved assignments from localStorage
    const stored = localStorage.getItem('cloneCraftRoundTwo')
    if (stored) {
      try {
        setAssignments(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse saved assignments")
      }
    }
    
    // Polling for updates
    const interval = setInterval(() => {
      const current = localStorage.getItem('cloneCraftRoundTwo')
      if (current !== stored) {
        try {
          setAssignments(current ? JSON.parse(current) : [])
        } catch (e) {
          // ignore
        }
      }
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  const handleDelete = (teamName: string) => {
    const updated = assignments.filter(a => a.team !== teamName)
    setAssignments(updated)
    localStorage.setItem('cloneCraftRoundTwo', JSON.stringify(updated))
  }

  const handleClearAll = () => {
    setAssignments([])
    localStorage.setItem('cloneCraftRoundTwo', JSON.stringify([]))
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
