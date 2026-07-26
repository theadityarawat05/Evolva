cat << 'EOF' > App.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { initializeApp } from './src/AppBootstrap';
import ChatScreen from './src/screens/chat/ChatScreen';
import Logger from './src/utils/Logger';

export default function App() {
	  const [isLoaded, setIsLoaded] = useState(false);
	    const [error, setError] = useState<string | null>(null);

	      useEffect(() => {
	      	    async function setup() {
	      	    	      try {
	      	    	      	        Logger.info('App: Triggering system bootstrap sequence.');
	      	    	      	                await initializeApp();
	      	    	      	                        setIsLoaded(true);
	      	    	      	                              } catch (err) {
	      	    	      	                              	        Logger.error('App: Bootstrap sequence failed.', err);
	      	    	      	                              	                setError(err instanceof Error ? err.message : String(err));
	      	    	      	                              	                      }
	      	    	      	                              	                          }
	      	    	      	                              	                              setup();
	      	    	      	                              	                                }, []);

	      	    	      	                              	                                  if (error) {
	      	    	      	                              	                                  	    return (
	      	    	      	                              	                                  	    	      <View style={styles.center}>
	      	    	      	                              	                                  	    	              <Text style={styles.errorText}>Initialization Error</Text>
	      	    	      	                              	                                  	    	                      <Text style={styles.subText}>{error}</Text>
	      	    	      	                              	                                  	    	                            </View>
	      	    	      	                              	                                  	    	                                );
	      	    	      	                              	                                  	    	                                  }

	      	    	      	                              	                                  	    	                                    if (!isLoaded) {
	      	    	      	                              	                                  	    	                                    	    return (
	      	    	      	                              	                                  	    	                                    	    	      <View style={styles.center}>
	      	    	      	                              	                                  	    	                                    	    	              <ActivityIndicator size="large" color="#4F46E5" />
	      	    	      	                              	                                  	    	                                    	    	                      <Text style={styles.loadingText}>Loading Evolva Engine...</Text>
	      	    	      	                              	                                  	    	                                    	    	                            </View>
	      	    	      	                              	                                  	    	                                    	    	                                );
	      	    	      	                              	                                  	    	                                    	    	                                  }

	      	    	      	                              	                                  	    	                                    	    	                                    return (
	      	    	      	                              	                                  	    	                                    	    	                                    	    <SafeAreaView style={styles.container}>
	      	    	      	                              	                                  	    	                                    	    	                                    	          <ChatScreen />
	      	    	      	                              	                                  	    	                                    	    	                                    	              </SafeAreaView>
	      	    	      	                              	                                  	    	                                    	    	                                    	                );
	      	    	      	                              	                                  	    	                                    	    	                                    	                }

	      	    	      	                              	                                  	    	                                    	    	                                    	                const styles = StyleSheet.create({
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  container: {
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	    flex: 1,
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	        backgroundColor: '#0F1115',
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	          },
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            center: {
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	    flex: 1,
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	        justifyContent: 'center',
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	            alignItems: 'center',
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                backgroundColor: '#0F1115',
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                    padding: 20,
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                      },
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        loadingText: {
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	    color: '#FFFFFF',
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	        marginTop: 14,
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	            fontSize: 16,
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	              },
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	                errorText: {
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	                	    color: '#EF4444',
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	                	        fontSize: 18,
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	                	            fontWeight: '700',
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	                	              },
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	                	                subText: {
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	                	                	    color: '#9CA3AF',
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	                	                	        marginTop: 8,
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	                	                	            textAlign: 'center',
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	                	                	              },
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	                	                	              });
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	                	                	              EOF
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	                	                	              
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	                	                }
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        	                }
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            	                        }
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  	            }
	      	    	      	                              	                                  	    	                                    	    	                                    	                	  }
	      	    	      	                              	                                  	    	                                    	    	                                    	                })
	      	    	      	                              	                                  	    	                                    	    	                                    )
	      	    	      	                              	                                  	    	                                    	    )
	      	    	      	                              	                                  	    	                                    }
	      	    	      	                              	                                  	    )
	      	    	      	                              	                                  }
	      	    	      	                              }
	      	    	      }
	      	    }
	      })
}
