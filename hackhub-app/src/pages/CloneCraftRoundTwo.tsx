import { useState, useEffect } from 'react'
import { Container, Title, Text, Table, Card, Group, Button, Stack } from '@mantine/core'
import { IconDeviceFloppy, IconRefresh, IconTrash } from '@tabler/icons-react'
import { websites, teams as allTeamsRaw } from '../data/clonecraftData'
import { supabase } from '../lib/supabaseClient'

interface Assignment {
  team: string
  website: string
}

export function CloneCraftRoundTwo() {
  const [savedAssignments, setSavedAssignments] = useState<Assignment[]>([])
  const [currentBatch, setCurrentBatch] = useState<Assignment[]>([])

  const fetchAssignments = async () => {
    const { data, error } = await supabase
      .from('clonecraft_assignments')
      .select('*')
      
    if (data && !error) {
      setAssignments(data)
    }
  }

  const setAssignments = (data: Assignment[]) => {
    setSavedAssignments(data)
  }

  useEffect(() => {
    fetchAssignments()
  }, [])

  const saveToSupabase = async (data: Assignment[]) => {
    const { error } = await supabase.from('clonecraft_assignments').insert(data)
    if (!error) {
      fetchAssignments()
    } else {
      alert("Error saving to database")
    }
  }

  const generateBatch = () => {
    // Unique teams
    const allTeams = Array.from(new Set(allTeamsRaw))
    
    // Find unassigned teams
    const assignedTeamNames = new Set(savedAssignments.map(a => a.team))
    let unassignedTeams = allTeams.filter(t => !assignedTeamNames.has(t))

    // Shuffle unassigned teams
    unassignedTeams = [...unassignedTeams].sort(() => 0.5 - Math.random())

    // Count current website usage
    const websiteUsage: Record<string, number> = {}
    websites.forEach(w => websiteUsage[w] = 0)
    savedAssignments.forEach(a => {
      if (websiteUsage[a.website] !== undefined) {
        websiteUsage[a.website]++
      }
    })

    const newBatch: Assignment[] = []
    
    for (const team of unassignedTeams) {
      if (newBatch.length >= 6) break

      const availableWebsites = websites.filter(w => websiteUsage[w] < 2)
      if (availableWebsites.length === 0) {
        // No websites left that can be assigned
        break
      }

      const chosenWebsite = availableWebsites[Math.floor(Math.random() * availableWebsites.length)]
      websiteUsage[chosenWebsite]++
      newBatch.push({ team, website: chosenWebsite })
    }

    setCurrentBatch(newBatch)
  }

  const saveBatch = async () => {
    await saveToSupabase(currentBatch)
    setCurrentBatch([])
  }

  const clearAll = async () => {
    await supabase.from('clonecraft_assignments').delete().neq('team', 'NON_EXISTENT_DUMMY')
    fetchAssignments()
    setCurrentBatch([])
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1}>Clone Craft - Round Two</Title>
          <Text c="dimmed" mt="xs">
            Assign websites to teams (Max 2 teams per website)
          </Text>
        </div>

        <Card withBorder radius="lg" shadow="sm">
          <Group justify="space-between" mb="md">
            <Title order={3}>Generate New Assignments</Title>
            <Button leftSection={<IconRefresh size={16} />} onClick={generateBatch}>
              Generate 6 Teams
            </Button>
          </Group>

          {currentBatch.length > 0 ? (
            <Stack>
              <Table variant="vertical" striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Team Name</Table.Th>
                    <Table.Th>Assigned Website</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {currentBatch.map((a, i) => (
                    <Table.Tr key={i}>
                      <Table.Td fw={500}>{a.team}</Table.Td>
                      <Table.Td>
                        <a href={a.website} target="_blank" rel="noreferrer" style={{ color: 'var(--mantine-color-blue-6)' }}>
                          {a.website}
                        </a>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <Group justify="flex-end">
                <Button color="green" leftSection={<IconDeviceFloppy size={16} />} onClick={saveBatch}>
                  Save Current Batch
                </Button>
              </Group>
            </Stack>
          ) : (
            <Text c="dimmed" fs="italic" ta="center" py="xl">
              Click generate to get 6 random teams and websites.
            </Text>
          )}
        </Card>

        <Card withBorder radius="lg" shadow="sm">
          <Group justify="space-between" mb="md">
            <Title order={3}>Saved Assignments ({savedAssignments.length})</Title>
            <Button variant="light" color="red" leftSection={<IconTrash size={16} />} onClick={clearAll} disabled={savedAssignments.length === 0}>
              Clear All
            </Button>
          </Group>

          {savedAssignments.length > 0 ? (
             <Table striped>
             <Table.Thead>
               <Table.Tr>
                 <Table.Th>Team Name</Table.Th>
                 <Table.Th>Assigned Website</Table.Th>
               </Table.Tr>
             </Table.Thead>
             <Table.Tbody>
               {savedAssignments.map((a, i) => (
                 <Table.Tr key={i}>
                   <Table.Td fw={500}>{a.team}</Table.Td>
                   <Table.Td>
                     <a href={a.website} target="_blank" rel="noreferrer" style={{ color: 'var(--mantine-color-blue-6)' }}>
                       {a.website}
                     </a>
                   </Table.Td>
                 </Table.Tr>
               ))}
             </Table.Tbody>
           </Table>
          ) : (
            <Text c="dimmed" fs="italic" ta="center" py="xl">
              No assignments saved yet.
            </Text>
          )}
        </Card>
      </Stack>
    </Container>
  )
}
